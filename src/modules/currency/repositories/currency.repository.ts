import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CurrencyEntity } from '../domain/currency.entity';
import { nameExcel } from '../../../config/currency.name.excel.config';
import { CURRENCY_TYPE } from '../../../config/currency.type.config';
import fs from 'fs';
import axios from 'axios';
import configAxios from '../../../config/request.config';
import path from 'path';
import * as XLSX from 'xlsx';
import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

// Interfaz para definir la estructura de las filas del Excel devueltas por XLSX
interface ExcelRow {
    'BANCO CENTRAL DE VENEZUELA'?: string;
    __EMPTY?: string;
    __EMPTY_1?: string;
    __EMPTY_2?: string;
    __EMPTY_3?: string;
    [key: string]: any;
};

@Injectable()
export class CurrencyRepository {

    constructor(
        @InjectRepository(CurrencyEntity)
        private readonly currencyRepository: Repository<CurrencyEntity>
    ) { };

    // Metodo para enviar el texto de bienvenida
    welcomeAPI(text: string): string {
        return text;
    };

    // Metodo para Descarga del Excel
    async downExcel(docWeb: Document): Promise<void> {
        const response = await axios(configAxios('stream', this.rutaExcel_BCV(docWeb)));
        const ruta: string = path.join(__dirname, '../../../download', nameExcel);
        const writer = fs.createWriteStream(ruta);

        // Transfiere los datos del archivo al stream de escritura
        response.data.pipe(writer);

        // Salida de la confirmación de la descarga del archivo
        return new Promise<void>((resolve, reject) => {
            writer.on('finish', () => resolve());
            writer.on('error', reject);
        });
    };

    // Lee el Excel UNA SOLA VEZ y devuelve todas las monedas procesadas
    parseAllCurrenciesFromExcel(): ICurrency[] {
        const ruta: string = path.join(__dirname, '../../../download', nameExcel);
        const workbook = XLSX.readFile(ruta);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

        // Extraer la clave de fecha (última columna de la fila vacía)
        const filaFecha = data.find(item => item['BANCO CENTRAL DE VENEZUELA'] === '');
        if (!filaFecha) return [];

        const claves = Object.keys(filaFecha);
        const claveFecha: string = claves[claves.length - 1];
        const lastUpdate = this.parseBCVDate(claveFecha);

        // Mapear todas las monedas en una sola pasada del arreglo
        const resultado: ICurrency[] = [];
        const validCurrencies: string[] = CURRENCY_TYPE;

        data.forEach((item: ExcelRow) => {
            const moneda = item['BANCO CENTRAL DE VENEZUELA']?.trim();
            
            // SOLO procesamos si la moneda está en nuestra lista de CURRENCY_TYPE
            if (moneda && validCurrencies.includes(moneda)) {
                resultado.push({
                    currency: moneda as CurrencyType,
                    country: item.__EMPTY ?? null,
                    purchaseRate: Number(item.__EMPTY_3) || 0,
                    saleRate: Number(item[claveFecha]) || 0,
                    lastUpdate,
                });
            };
        });

        return resultado;
    };

    // Guarda todas las monedas ignorando duplicados silenciosamente
    async bulkUpsertCurrencies(data: ICurrency[]): Promise<void> {
        if (data.length === 0) return;

        try {
            // insert() directo: no intenta "updates", solo insertar.
            await this.currencyRepository.insert(data as any[]);
        } catch (error) {
            // Si el error es duplicado de clave única (MySQL: ER_DUP_ENTRY), lo ignoramos.
            // Significa que los datos ya estaban en la BD.
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                console.log('------> Datos ya actualizados en la BD (duplicados omitidos) <------');
                return;
            };
            // Cualquier otro error sí lo lanzamos
            throw error;
        };
    };

    // Metodo para obtener los ultimos registros de la Base de Datos (un registro por moneda)
    async getLatestSavedCurrencies(): Promise<CurrencyEntity[]> {
        // Subconsulta: obtener el id más reciente por cada moneda
        return await this.currencyRepository
            .createQueryBuilder('c')
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(sub.id)')
                    .from(CurrencyEntity, 'sub')
                    .groupBy('sub.currency')
                    .getQuery();
                return `c.id IN ${subQuery}`;
            })
            .orderBy('c.currency', 'ASC')
            .getMany();
    };

    async getCurrencyByFilter(
        currency?: CurrencyType | CurrencyType[],
        dateFrom?: Date,
        dateTo?: Date
    ): Promise<CurrencyEntity[]> {

        // Inicializa el Where vacío
        const where: any = {};

        // 1. Filtro dinámico de monedas (una o un array)
        if (currency) where.currency = Array.isArray(currency) ? In(currency) : currency;

        // 2. Filtro dinámico de fechas
        if (dateFrom && dateTo) {
            where.lastUpdate = Between(dateFrom, dateTo);
        } else if (dateFrom) {
            where.lastUpdate = MoreThanOrEqual(dateFrom);
        } else if (dateTo) {
            where.lastUpdate = LessThanOrEqual(dateTo);
        };

        // Registros obtenidos y devolución de datos según los filtros aplicados
        return await this.currencyRepository.find({
            where,
            order: { lastUpdate: 'DESC' },
        });
    };

    rutaExcel_BCV(documento: Document): string {
        let rutaExcel = documento?.querySelector('#block-system-main table tbody .file a') as HTMLAnchorElement | null;
        return rutaExcel?.href as string;
    };

    // Conversión de fecha del BCV (formato "DD/MM/YYYY HH:MM AM/PM")
    private parseBCVDate(fechaString: string): Date {
        try {
            const [fechaPart, horaPart, ampm] = fechaString.split(' ');

            if (!fechaPart) return new Date();

            const [dia, mes, anio] = fechaPart.split('/');

            let hr = 0;
            let min = 0;

            if (horaPart) {
                const [horas, minutos] = horaPart.split(':');
                hr = Number(horas);
                min = Number(minutos);

                if (ampm) {
                    if (ampm.toUpperCase() === 'PM' && hr < 12) hr += 12;
                    if (ampm.toUpperCase() === 'AM' && hr === 12) hr = 0;
                };
            };

            return new Date(Number(anio), Number(mes) - 1, Number(dia), hr, min);
        } catch (error) {
            return new Date();
        };
    };
};