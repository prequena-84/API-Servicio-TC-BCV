const moment = require('moment');

// Definición de Fecha Servidor
module.exports = function() {
    const 
        dia = moment().date(),
        // Obtiene el mes sumandole 1 ya que moment retorna los meses como un index 0 - 11
        mes = moment().month() + 1,
        año = moment().year()
    ;

    return `${dia}_${mes}_${año}`;
};