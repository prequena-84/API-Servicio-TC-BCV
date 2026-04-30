import axios, { AxiosResponse } from 'axios';
import { CurrencyEntity } from '../domain/currency.entity';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CurrencyRepository } from '../repositories/currency.repository';
import { JSDOM } from 'jsdom';
import configAxios from '../../../config/request.config';
import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

@Injectable()
export class CurrencyService {
    constructor(private readonly currencyRepository: CurrencyRepository) { };

    // Método privado centralizado: descarga, parsea y guarda en BD sin duplicados
    private async runBCVSync(): Promise<ICurrency[]> {
        const urlBcv: string = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc';

        const response: AxiosResponse<string> = await axios(configAxios('text', urlBcv));
        const htmlDoc: string = response.data;
        const doc: Document = new JSDOM(htmlDoc).window.document;

        // Descarga el Excel del BCV
        await this.currencyRepository.downExcel(doc);
        console.log('------> Descarga Satisfactoria del Archivo <------');

        // Lee el Excel UNA sola vez y obtiene todas las monedas
        const currencies: ICurrency[] = this.currencyRepository.parseAllCurrenciesFromExcel();

        // Guarda en bloque con upsert (ignora duplicados por currency + lastUpdate)
        await this.currencyRepository.bulkUpsertCurrencies(currencies);
        console.log(`------> ${currencies.length} monedas procesadas (duplicados ignorados) <------`);

        return currencies;
    };

    // GET /api/v1/currencies — Intenta sincronizar en vivo, fallback a BD si falla
    async getCurrencies(currency?: CurrencyType): Promise<ICurrency[]> {
        let results: ICurrency[] = [];
        try {
            // 1. Intento en vivo al BCV
            results = await this.runBCVSync();
            console.log('------> Consulta en Vivo al BCV Exitosa <------');
        } catch (err) {
            // 2. Fallback: Si el BCV no responde, devolvemos el último registro de la BD
            console.warn(`[FALLBACK] BCV no disponible: ${err.message}. Retornando último registro de la BD.`);
            const fallbackData = await this.currencyRepository.getLatestSavedCurrencies();
            if (fallbackData.length === 0) {
                throw new BadRequestException('El BCV no está disponible y no hay registros previos en la base de datos.');
            }
            results = fallbackData as unknown as ICurrency[];
        }
        // Aplicamos el filtro al final (sirve para ambos casos)
        if (currency) {
            console.log(`Filtrando respuesta por moneda: ${currency}`);
            return results.filter((item: ICurrency) => item.currency === currency);
        }
        return results;
    };

    // GET /api/v1/currencies/filters — Filtro histórico por moneda y/o fechas
    async getCurrencyByFilter(
        currency?: CurrencyType | CurrencyType[],
        dateFrom?: Date,
        dateTo?: Date
    ): Promise<CurrencyEntity[]> {
        return await this.currencyRepository.getCurrencyByFilter(currency, dateFrom, dateTo);
    };

    // Tarea Programada: 12 AM, 6 AM, 12 PM, 4 PM, 5 PM, 6 PM, 7 PM
    //@Cron('0 0,6,12,16,17,18,19 * * *')  // Ejecución 7 veceas al día
    //@Cron('0,00 * * * *')                // Ejecución A cada 30 minutos
    @Cron('0,15,30,45 * * * *')            // Ejecución a cada 15 minutos
    async syncCurrenciesFromBCV(): Promise<void> {
        try {
            await this.runBCVSync();
            console.log('-------> Sincronización Automática con BCV Exitosa <------');
        } catch (err) {
            if (err instanceof HttpException) throw err;
            console.error(`[CRON ERROR] Error en sincronización automática: ${err.message}`);
        };
    };
};