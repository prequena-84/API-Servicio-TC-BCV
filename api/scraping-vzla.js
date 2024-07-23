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

    const 
        TC = Tipo_Cambio,
        TcBCV = [],
        url = 'https://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc'
    ;

    let
        response = await got(url),
        docWeb = new JSDOM(response.body).window.document,
        nombreExcel = `${FechaServidor()}_BCV.xls`;
    ;

    // Definimos el nombre automatico de la Descarga de Excel que contiene los datos de los Tipo de Cambios en el sevidor
    setDataExcel(nombreExcel);

    // Función que descarga
    await Promise.all([
        FN_DescargaExcel(RutaExcel_BCV(docWeb))
            .then(() => console.log('Descarga Sastifactoria del Archivo'))
            .catch( err => console.log(`Error al descargar el archivo: ${err}`))
    ]);
    
    //Carga de Información en el Objecto de respuesta con el Tipo de Cambio
    TC.map(item => {
        if ( FN_TC1(item).Moneda !== '' ) {
            TcBCV.push(FN_TC1(item))
        };
    });

    // Envio de Respuesta del Servidor
    res.status(200).send(TcBCV);

    // Funcion para definir la extracción del periodo correcto en TC
    function RutaExcel_BCV(documento) {
        let rutaExcel = documento.querySelector('#block-system-main table tbody .file a').href;
        return rutaExcel;
    };
});

module.exports = router;