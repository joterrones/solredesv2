const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;


const insertplanilla = (request, response) => {
    let element = request.body;
    var cadena = 'select id,c_mensaje, b_flag,n_flag from fn_node_insert_planilla_lprp( ' +
        element.TIPO + ',\'' +
        element.CIRCUITO + '\',\'' +
        element.LINEA + '\',\'' +
        element.NRO_SSEE + '\',\'' +
        element.ESTRUCTURA + '\',\'' +
        element.ESTRUCTURA_ANTERIOR + '\',\'' +
        element.ARMADO_P + '\',\'' +
        element.ARMADO_S + '\',' +
        element.PROGRESIVA + ',' +
        element.VANO + ',\'' +
        element.T_TERRENO + '\',' +
        element.S_CANTIDAD + ',\'' +
        element.S_TIPO + '\',\'' +
        element.COOR_E + '\',\'' +
        element.COOR_N + '\',' +
        element.CONDUCTOR_35 + ',' +
        element.CONDUCTOR_70 + ',' +
        element._1X16_25 + ',' +
        element._1X16_1X16_25 + ',' +
        element._2X16_25 + ',' +
        element._2X16_1X16_25 + ',' +
        element._2X25_25 + ',' +
        element._2X25_1X16_25 + ',' +
        element.AISLADOR_56_3 + ',' +
        element.AISLADOR_POLIMERICO + ',' +
        element.AMOR_35 + ',' +
        element.AMOR_70 + ',' +
        element.RI_A + ',' +
        element.RV_A + ',' +
        element.RI_MT + ',' +
        element.RV_MT + ',' +
        element.RI + ',' +
        element.RV + ',' +
        element.RIY + ',' +
        element.RVY + ',' +
        element.AP_BT + ',' +
        element.AP_MT + ',' +
        element.PAT_1 + ',' +
        element.PAT_1S + ',' +
        element.PAT_1C + ',' +
        element.PAT_2 + ',' +
        element.PAT_3 + ',' +
        element.PAT_1CS + ',' +
        element.PAT_2S + ',' +
        element.PAT_3S + ',\'' +
        element.COTA + '\',\'' +
        element.ANGULO + '\',\'' +
        element.VERTICE + '\',' +
        element.TRANS_5 + ',' +
        element.TRANS_10 + ',' +
        element.TRANS_15 + ',' +
        element.FASES + ',' +
        element.ZONA +
        ')'

    pool.query(cadena
        , (error, results) => {
            if (error) {
                console.log(cadena);
                response.status(200).json({ estado: false, mensaje: "error del servicio:" + error.stack, data: element });
            } else {
                if (results.rows.length > 0) {
                    element.ESTADO = results.rows[0].b_flag;
                    element.MENSAJE = results.rows[0].c_mensaje;
                    if (!element.ESTADO) {
                        console.log(cadena);
                    }
                    response.status(200).json({ estado: true, mensaje: "", data: element });
                }
            }
        })
}

module.exports = {
    insertplanilla
}