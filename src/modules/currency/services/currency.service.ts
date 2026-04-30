import axios, { AxiosResponse } from 'axios';
import { CurrencyEntity } from '../domain/currency.entity';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CURRENCY_TYPE } from '../../../config/currency.type.config';
import { CurrencyRepository } from '../repositories/currency.repository';
import { JSDOM } from 'jsdom';
import configAxios from '../../../config/request.config';

import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

@Injectable()
export class CurrencyService {
    constructor(private readonly currencyRepository: CurrencyRepository) { };

    // Consulta en vivo al BCV. Si falla, devuelve el último registro de la BD (Fallback)
    async getCurrencies(): Promise<ICurrency[]> {
        const currencies: CurrencyType[] = CURRENCY_TYPE;
        const tcBcv: ICurrency[] = [];
        const urlBcv: string = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc';

        try {
            // 1. Intento en vivo al BCV
            const response: AxiosResponse<string> = await axios(configAxios('text', urlBcv));
            const htmlDoc: string = response.data;
            const doc: Document = new JSDOM(htmlDoc).window.document;

            await this.currencyRepository.downExcel(doc);
            console.log('------> Descarga Satisfactoria del Archivo <------');

            for (const currency of currencies) {
                const extract = this.currencyRepository.extractDataExcel(currency);
                if (extract.currency !== null) {
                    await this.currencyRepository.recordingCurrency(extract);
                    tcBcv.push(extract as ICurrency);
                };
            };

            console.log('------> Consulta en Vivo al BCV Exitosa <------');
            return tcBcv;

        } catch (err) {
            // 2. Fallback: Si el BCV no responde, devolvemos el último registro de la BD
            console.warn(`[FALLBACK] BCV no disponible: ${err.message}. Retornando último registro de la BD.`);
            const fallbackData = await this.currencyRepository.getLatestSavedCurrencies();

            if (fallbackData.length === 0) {
                throw new BadRequestException('El BCV no está disponible y no hay registros previos en la base de datos.');
            };

            return fallbackData as unknown as ICurrency[];
        };
    };

    async getCurrencyByFilter(
        currency?: CurrencyType | CurrencyType[],
        dateFrom?: Date,
        dateTo?: Date
    ):Promise<CurrencyEntity[]> {
        return await this.currencyRepository.getCurrencyByFilter(currency, dateFrom, dateTo);
    };

    // Tarea Programada: 12 AM, 6 AM, 12 PM, 4 PM, 5 PM, 6 PM, 7 PM
    @Cron('0 0,6,12,16,17,18,19 * * *')
    async syncCurrenciesFromBCV(): Promise<void> {
        const currencies: CurrencyType[] = CURRENCY_TYPE;
        const tcBcv: Partial<ICurrency[]> = [];
        const urlBcv: string = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc';

        try {
            const response: AxiosResponse<string> = await axios(configAxios('text', urlBcv));
            const htmlDoc: string = response.data;

            const doc: Document = new JSDOM(htmlDoc).window.document;

            // Función de carga de archivo
            await this.currencyRepository.downExcel(doc);
            console.log('------> Descarga Satisfactoria del Archivo<------');

            // Carga de información en el Objecto de respuesta con el Tipo de Cambio
            for (const currency of currencies) {
                const extract = this.currencyRepository.extractDataExcel(currency);
                if (extract.currency !== null) {
                    await this.currencyRepository.recordingCurrency(extract);
                    console.log('------> Registro de Moneda <------');
                    tcBcv.push(extract);
                };
            };

            console.log('-------> Sincronización Automática con BCV Exitosa <------');
            // return tcBcv as ICurrency[]; Ya no necesitamos retornar nada a la API
            
        } catch(err) {
            if (err instanceof HttpException) throw err;
            throw new BadRequestException(`Error al obtener el HTML del BCV: ${err.message}`);
        };
    };
};

/*
    me queda pendiente crear ese job con la libreria de nest para poner a cargar la consulta en un intervalo de tiempo de 24 horas,
    , luego crear el endpoint para que usuario meta la consulta de la tasa que quiera aplicar en su api, 
    , luego agregar el filter global para capturar los errores y agregar los controladores de errores en los psoibles errores, sino agregar las descarga a cada 12 horas y 
    con un distinc intentar que la misma base de daatos rechace el registro si lo capturo en la otra vuelta en ese dia, capaz pueda funcionar mejor.
    luego de eso aplicar las cors para que los otros desarrolladores pueda agregar sus proyectos, integrar el guards para que se comuniquen las App entre sí y ademas
    crear un metodo para jalar por un filro las monedas y con fecha desde hasta para crear un repórte de variacion cambiara y apoyar las posibles graficas de tendencia.
    y por ultimo subir a producción em aws que al usuario se le haria mas facil agregar los endpoint de cors desde la configuración.
*/