const express = require('express');
const servicioTC1 = require('./api/scraping-vzla');
const app = express();
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, './.env.dev') });

app.all('/', (req, res) => {
    res.send("Bienvenido a la API SIEMENS IMPORTACIÓN DE TIPO CAMBIOS")
});

app.use(cors());
app.use('/5575', servicioTC1);

const servidor = app.listen(process.env.Port || 3500, () => {
    console.log('Para configurar los tipos de cambios que necesitas obtener lo puedes configurar en el archivo JS "Config-TC.js"');
    console.log(`Servidor corriendo en el puerto ${servidor.address().port}`);
    console.log(`Para activar la APP ingresa en Chrome a: http://localhost:${servidor.address().port}/5575/ImporTipoCambio-1`);
});