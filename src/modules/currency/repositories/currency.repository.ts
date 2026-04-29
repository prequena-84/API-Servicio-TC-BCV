import { Injectable } from '@nestjs/common';
import { CurrencyEntity } from '../domain/currency.entity';
//import { CURRENCY_TYPE } from '../../../config/currency.type.config';
//import { JSDOM } from 'jsdom';
import { nameExcel } from '../../../config/currency.name.excel.config';

import fs from 'fs';
import axios from 'axios';
import configAxios from '../../../config/request.config';
import path from 'path';
import * as XLSX from 'xlsx';

import type { ICurrency } from '../interfaces/types/currency.interfaces';

@Injectable()
export class CurrencyRepository {

    constructor(private readonly currencyRepository: CurrencyEntity) {};

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
    extractDataExcel(tipoCambio: string):ICurrency {
        
        const objExcel1: any[] = [];
        const objExcel2: any[] = [];
        const ruta:string = path.join(__dirname, '../../../download', nameExcel);
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
            if ( item['BANCO CENTRAL DE VENEZUELA'] == '' ) {
                objExcel1.push({
                    column: item
                });
            };
        });

        const objecto:object = objExcel1[0].column;
        const clave:string[] = Object.keys(objecto);
        const claveFecha:string = clave[clave.length - 1];
        console.log(claveFecha);

        //Ejemplo de Lectura
        data.forEach((item: ExcelRow) => {
            if (item['BANCO CENTRAL DE VENEZUELA'] == tipoCambio) {
                objExcel2.push({
                    'Moneda/País':item.__EMPTY,
                    'Compra1':item.__EMPTY_1,
                    'Venta1':item.__EMPTY_2,
                    'Compra2':item.__EMPTY_3,
                    'Venta2':item[`${claveFecha}`]
                });
            };
        });

        // Retorno del Objeto
        if (objExcel2.length > 0) {
            return {
                currencyCode: objExcel2[0]['Moneda/País'],
                purchaseRate: objExcel2[0].Compra2,
                saleRate:  objExcel2[0].Venta2,
            };
        } else {
            return { currencyCode: null, purchaseRate: 0.00, saleRate: 0.00 };
        };
    };

    rutaExcel_BCV(documento: Document): string {
        let rutaExcel = documento?.querySelector('#block-system-main table tbody .file a') as HTMLAnchorElement | null;
        return rutaExcel?.href as string;
    };
};