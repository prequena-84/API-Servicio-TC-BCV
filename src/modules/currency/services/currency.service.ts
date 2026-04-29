import axios, { AxiosResponse  } from 'axios';
//import { CurrencyEntity } from '../domain/currency.entity';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { CURRENCY_TYPE } from '../../../config/currency.type.config';
import { CurrencyRepository } from '../repositories/currency.repository';
import { JSDOM } from 'jsdom';
import configAxios from '../../../config/request.config';

import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

@Injectable()
export class CurrencyService {
    constructor(private readonly currencyRepository:CurrencyRepository) {};

    async getCurrency(): Promise<ICurrency[]> {
        const currencies:CurrencyType[] = CURRENCY_TYPE;
        const tcBcv:Partial<ICurrency[]> = [];
        const urlBcv: string = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc';

        try {
            const response:AxiosResponse<string> = await axios(configAxios('text',urlBcv));
            const htmlDoc:string = response.data;

            const doc:Document = new JSDOM(htmlDoc).window.document;
            
            // Función de carga de archivo
            await this.currencyRepository.downExcel(doc);
            console.log('------> Descarga Satisfactoria del Archivo<------');

            // Carga de información en el Objecto de respuesta con el Tipo de Cambio
            currencies.forEach((item: CurrencyType) => {
                const extract = this.currencyRepository.extractDataExcel(item);
                if (extract.currency !== null) {
                    this.currencyRepository.recordingCurrency(extract);
                    console.log('------> Registro de Moneda <------');
                    tcBcv.push(extract);
                };
            });

            console.log('-------> Informacion Extraida con Exito<------');
            return tcBcv as ICurrency[];
            
        } catch(err) {
            if (err instanceof HttpException) throw err;
            throw new BadRequestException(`Error al obtener el HTML del BCV: ${err.message}`);
        };
    };
};