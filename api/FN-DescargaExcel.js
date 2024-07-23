const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { getDataExcel } = require('./ObjExcel'); 

module.exports = async function(urlArchivo) {
    try {

        // Hace la petición GET al URL del archivo
        const response = await axios({
                method: 'GET',
                url: urlArchivo,
                responseType: 'stream'
            }),
            // Define la ruta completa donde se guardará el archivo
            ruta = path.join(path.resolve(__dirname, '..'), `/download/${getDataExcel()}`),   
            // Crea un stream de escritura para guardar el archivo
            writer = fs.createWriteStream(ruta)
        ;

        // Transfiere los datos del archivo al stream de escritura
        response.data.pipe(writer);

        // Salida de la confirmación de la descarga del archivo
        return new Promise((resolve,reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch(err) {
        console.log(`Error al descargar el archivo: ${err}`);
    };
};