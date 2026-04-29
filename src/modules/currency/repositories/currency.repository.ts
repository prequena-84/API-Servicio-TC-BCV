import { Injectable } from '@nestjs/common';
import { CurrencyEntity } from '../domain/currency.entity';
import { CURRENCY_TYPE } from '../../../config/currency.type.config';
import { JSDOM } from 'jsdom';
import { nameExcel } from '../../../config/currency.name.excel.config';

import fs from 'fs';
import axios, { AxiosResponse, ResponseType  } from 'axios';
import configAxios from '../../../config/request.config';
import path from 'path';

import type { ICurrency } from '../interfaces/types/currency.interfaces';
import type { CurrencyType } from '../interfaces/types/currency.types';

@Injectable()
export class CurrencyRepository {

    constructor(private readonly currencyRepository: CurrencyEntity) {};

    // Metodo para enviar el texto de bienvenida
    welcomeAPI(text: string): string {
        return text;
    };

    // Metodo para Descarga del excel
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

    rutaExcel_BCV(documento: Document): string {
        let rutaExcel = documento?.querySelector('#block-system-main table tbody .file a') as HTMLAnchorElement | null;
        return rutaExcel?.href as string;
    };

    



    /**
     * quede en refactorirzar el archivo Scraping-vzla luego ir recomponiendo el codigo y aplicando los cambios de las funciones
     * que descomponen el excel y envia datos a la base de datos. (replicar la descarga del archivo para el admin )
     **/


};