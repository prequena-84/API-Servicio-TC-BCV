import axios, { AxiosResponse  } from 'axios';
import { CurrencyEntity } from '../domain/currency.entity';
import { Injectable } from '@nestjs/common';
import { CURRENCY_TYPE } from '../../../config/currency.type.config';
import { CurrencyRepository } from '../repositories/currency.repository';
import { JSDOM } from 'jsdom';
import { nameExcel } from '../../../config/currency.name.excel.config';
import configAxios from '../../../config/request.config';

import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

@Injectable()
export class CurrencyService {

    constructor(private readonly currencyRepository:CurrencyRepository) {};

    async createCurrency(data: ICurrency): Promise<CurrencyEntity> {

        const currencies:CurrencyType[] = CURRENCY_TYPE;
        const tcBcv:ICurrency[] = [];
        const urlBcv: string = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc';

        try {

            const response:AxiosResponse<string> = await axios(configAxios('text',urlBcv));
            const htmlDoc:string = response.data;

            const doc:Document = new JSDOM(htmlDoc).window.document;
            



        } catch(err) {
            console.error("Error al obtener el HTML del BCV:", err);
        };


    };


};