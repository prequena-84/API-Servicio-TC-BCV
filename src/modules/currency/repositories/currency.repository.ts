import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CurrencyEntity } from '../domain/currency.entity';
//import { CURRENCY_TYPE } from '../../../config/currency.type.config';
//import { JSDOM } from 'jsdom';
import { nameExcel } from '../../../config/currency.name.excel.config';

import { CurrencyDto } from '../interfaces/dto/currency.dto';

import fs from 'fs';
import axios from 'axios';
import configAxios from '../../../config/request.config';
import path from 'path';
import * as XLSX from 'xlsx';

import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

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

    // Extracción del Excel
    extractDataExcel(tipoCambio: string): ICurrency {
        const objExcel1: any[] = [];
        const objExcel2: any[] = [];
        const ruta: string = path.join(__dirname, '../../../download', nameExcel);
        const workbook = XLSX.readFile(ruta);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Interfaz para definir la estructura de las filas del Excel devueltas por XLSX
        interface ExcelRow {
            'BANCO CENTRAL DE VENEZUELA'?: string;
            __EMPTY?: string;
            __EMPTY_1?: string;
            __EMPTY_2?: string;
            __EMPTY_3?: string;
            [key: string]: any;
        };
        const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

        data.forEach((item: ExcelRow) => {
            if (item['BANCO CENTRAL DE VENEZUELA'] == '') {
                objExcel1.push({
                    column: item
                });
            };
        });

        const objecto: object = objExcel1[0].column;
        const clave: string[] = Object.keys(objecto);
        const claveFecha: string = clave[clave.length - 1];

        //Ejemplo de Lectura
        data.forEach((item: ExcelRow) => {
            if (item['BANCO CENTRAL DE VENEZUELA'] == tipoCambio) {
                objExcel2.push({
                    currency: item['BANCO CENTRAL DE VENEZUELA'],
                    country: item.__EMPTY,
                    purchaseRate: item.__EMPTY_3,
                    saleRate: item[`${claveFecha}`],
                    lastUpdate: this.parseBCVDate(claveFecha),
                });
            };
        });

        // Retorno del Objeto
        if (objExcel2.length > 0) {
            return {
                currency: objExcel2[0].currency,
                country: objExcel2[0].country,
                purchaseRate: objExcel2[0].purchaseRate,
                saleRate: objExcel2[0].saleRate,
                lastUpdate: objExcel2[0].lastUpdate,
            };
        } else {
            return {
                currency: null,
                country: null,
                purchaseRate: 0.00,
                saleRate: 0.00,
                lastUpdate: new Date(),
            };
        };
    };

    // MEtodo para guardar los datos en la Entidad
    async recordingCurrency(data: Partial<CurrencyDto>): Promise<CurrencyEntity> {
        const newCurrency = this.currencyRepository.create(data);
        return await this.currencyRepository.save(newCurrency);
    };

    // Metodo para obtener los ultimos registros de la Base de Datos
    async getLatestSavedCurrencies(): Promise<CurrencyEntity[]> {
        return await this.currencyRepository.find({
            order: { id: 'DESC' },
            take: 21,
        });
    };

    async getCurrencyByFilter(
        currency?: CurrencyType | CurrencyType[],
        dateFrom?: Date,
        dateTo?: Date
    ): Promise<CurrencyEntity[]> {

        // Inicializa el Where vacio
        const where: any = {};

        // 1. Filtro dinámico de monedas
        if (currency) where.currency = Array.isArray(currency) ? In(currency) : currency;
    
        // 2. Filtro dinámico de fechas
        if (dateFrom && dateTo) {
            // Si vienen ambas, usamos el rango
            where.lastUpdate = Between(dateFrom, dateTo);
        } else if (dateFrom) {
            // Si solo viene 'desde', buscamos todo lo posterior a esa fecha
            where.lastUpdate = MoreThanOrEqual(dateFrom);
        } else if (dateTo) {
            // Si solo viene 'hasta', buscamos todo lo anterior a esa fecha
            where.lastUpdate = LessThanOrEqual(dateTo);
        };

        // registros obtenidos y devolución de datos según los filtros aplicados
        return await this.currencyRepository.find({
            where,
            order: {
                lastUpdate: 'DESC',
            },
        });
    }; 

    rutaExcel_BCV(documento: Document): string {
        let rutaExcel = documento?.querySelector('#block-system-main table tbody .file a') as HTMLAnchorElement | null;
        return rutaExcel?.href as string;
    };

    // conversion de fecha del BCV
    private parseBCVDate(fechaString: string): Date {
        try {
            // Espera un formato tipo "28/04/2026 04:47 PM"
            const [fechaPart, horaPart, ampm] = fechaString.split(' ');
            
            if (!fechaPart) return new Date(); // Fallback
            
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
                }
            }

            return new Date(Number(anio), Number(mes) - 1, Number(dia), hr, min);
        } catch (error) {
            return new Date(); 
        };
    };
};