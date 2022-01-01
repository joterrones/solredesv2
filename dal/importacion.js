const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;


const insertlinea = async (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let i = 0;
        let resultados = [];
        let estructuras = request.body.estructuras;
        estructuras.forEach(async element => {
            try {
                var cadena = 'select id,c_mensaje, b_flag,n_flag from fn_node_insert_planilla_linea( \'' +
                    element.NOMBRE_LINEA + '\',\'' +
                    element.CODIGO_LINEA + '\',\'' +
                    element.TIPO_LINEA + '\',\'' +
                    element.ZONA + '\'' +
                    ')';
                let queryImportacion = await pool.query(cadena);

                if (queryImportacion.rowCount > 0) {
                    element.b_flag = queryImportacion.rows[0].b_flag
                    element.c_mensaje = queryImportacion.rows[0].c_mensaje
                    resultados.push(element);
                    if (!queryImportacion.rows[0].b_flag) {
                        console.log("insertlinea cadena", cadena);
                    }
                }
            } catch (error) {
                element.b_flag = false;
                element.c_mensaje = "error:" + error;
                resultados.push(element);
            }
            i++;
            if (estructuras.length <= i) {
                response.status(200).json({ estado: true, mensaje: "vueltas: " + i, data: resultados });
            }
        });

    } else {
        response.status(200).json(obj)
    }

}

const insertplanilla = async (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let i = 0;
        let resultados = [];
        let estructuras = request.body.estructuras;
        estructuras.forEach(async element => {
            try {
                var cadena = 'select id,c_mensaje, b_flag,n_flag from fn_node_insert_planilla_lprp( ' +
                    element.TIPO + ',\'' +
                    element.CIRCUITO + '\',\'' +
                    element.LINEA + '\',\'' + //*
                    element.NRO_SSEE + '\',\'' + //*
                    element.ESTRUCTURA + '\',\'' +
                    element.ESTRUCTURA_ANTERIOR + '\',\'' +
                    element.ARMADO_P + '\',\'' +
                    element.ARMADO_S + '\',\'' +
                    element.ARMADO_RS_SE + '\',' +
                    element.PROGRESIVA + ',' +
                    element.VANO + ',\'' +
                    element.T_TERRENO + '\',' +
                    element.S_CANTIDAD + ',\'' +
                    element.S_TIPO + '\',\'' +
                    element.COOR_E + '\',\'' +
                    element.COOR_N + '\',\'' +
                    element.TIPO_CONDUCTOR + '\',' +
                    element.CANTIDAD_CONDUCTOR + ',' +
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
                    element.AP_BT_ANGULO + ',' +
                    element.AP_MT + ',' +
                    element.AP_MT_ANGULO + ',' +
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
                    element.VERTICE + '\',\'' +
                    element.TIPO_TRANS + '\',' +
                    element.CANTIDAD_TRANS + ',' +
                    element.FASES + ',' +
                    element.ZONA + ',\'' +
                    element.FUNCION_ARMADO + '\',' +
                    element.VERSION +
                    ')';
                let queryImportacion = await pool.query(cadena);

                if (queryImportacion.rowCount > 0) {
                    element.b_flag = queryImportacion.rows[0].b_flag
                    element.c_mensaje = queryImportacion.rows[0].c_mensaje
                    resultados.push(element);
                    if (!queryImportacion.rows[0].b_flag) {
                        console.log("insertplanilla cadena", cadena);
                    }
                }
            } catch (error) {
                element.b_flag = false;
                element.c_mensaje = "error:" + error;
                resultados.push(element);
            }
            i++;
            if (estructuras.length <= i) {
                response.status(200).json({ estado: true, mensaje: "vueltas: " + i, data: resultados });
            }
        });

    } else {
        response.status(200).json(obj)
    }

}

const creargeom = async (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let i = 0;
        try {
            var cadena = 'select c_mensaje, b_flag from fn_geom_actualizaestructuras()';
            let queryImportacion = await pool.query(cadena);
            response.status(200).json({ estado: true, mensaje: "vueltas: " + i, data: queryImportacion.rows });
        } catch (error) {
            response.status(200).json({ estado: false, mensaje: error + i, data: null });
        }

    } else {
        response.status(200).json(obj)
    }

}

module.exports = {
    insertplanilla,
    insertlinea,
    creargeom
}