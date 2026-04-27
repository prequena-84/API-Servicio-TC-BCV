const express = require('express');
const router =  express.Router();
const bodyparse = require('body-parser');
const FN_TC1 = require('./FN-ExtraerTC-VZLA');
const FN_DescargaExcel = require('./FN-DescargaExcel');
const { setDataExcel, getDataExcel } = require('./ObjExcel');
const got = require('got');
const { JSDOM } = require('jsdom');
const FechaServidor = require('./FN-Definicion-Fecha');
const Tipo_Cambio = require('./Config-TC');

router.use(bodyparse.urlencoded({extended:false}));
router.use(bodyparse.json());

router.get('/', (req, res) =>  {
    try {
        res.status(200).send({
            mensaje:'API descarga de TC Banco Central de Venezuela'
        });
    } catch(err) {
        res.status(500).send({
            mensaje:`Error en la Api: ${err}`
        });
    };
});

router.get('/ImporTipoCambio-1', async (req, res) => {

    try {
        const 
            TC = Tipo_Cambio,
            TcBCV = [],
            url = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc'
        ;

        const response = await got(url, {
            https: {
                rejectUnauthorized: false
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });

        const docWeb = new JSDOM(response.body).window.document;
        const nombreExcel = `${FechaServidor()}_BCV.xls`;

        // Definimos el nombre automatico de la Descarga de Excel que contiene los datos de los Tipo de Cambios en el sevidor
        setDataExcel(nombreExcel);

        // Función que descarga
        await FN_DescargaExcel(RutaExcel_BCV(docWeb));
        console.log('Descarga Satisfactoria del Archivo');
        
        //Carga de Información en el Objecto de respuesta con el Tipo de Cambio
        TC.map(item => {
            if ( FN_TC1(item).Moneda !== '' ) {
                TcBCV.push(FN_TC1(item))
            };
        });

        // Envio de Respuesta del Servidor
        res.status(200).send(TcBCV);

    } catch (err) {
        console.error('Error en scraping:', err);
        res.status(500).send({
            mensaje: `Error en la Api: ${err.message}`
        });
    }

    // Funcion para definir la extracción del periodo correcto en TC
    function RutaExcel_BCV(documento) {
        let rutaExcel = documento.querySelector('#block-system-main table tbody .file a').href;
        return rutaExcel;
    };
});

module.exports = router;