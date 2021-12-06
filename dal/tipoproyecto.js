const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const get = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_tipoproyecto,c_nombre from gen_tipoproyecto where n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const save = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_tipoproyecto = request.body.n_idgen_tipoproyecto;
        let c_nombre = request.body.c_nombre;
        let cadena = '';
        if (n_idgen_tipoproyecto == 0) {
            cadena = 'insert into gen_tipoproyecto(n_idgen_tipoproyecto,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,\'' + c_nombre + '\',0,now(),1);';
        } else {
            cadena = 'update gen_tipoproyecto set c_nombre= \'' + c_nombre + '\' where n_idgen_tipoproyecto=' + n_idgen_tipoproyecto + ';';
        }
        console.log(cadena)
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}
const delete_tipoproyecto = (request, response) => {
    var obj = valida.validaToken(request)
 
    if (obj.estado) {
   
        let n_idgen_tipoproyecto = request.body.n_idgen_tipoproyecto;
        let cadena = '';
        if (n_idgen_tipoproyecto > 0) {
     
            cadena = 'update gen_tipoproyecto set n_borrado= n_idgen_tipoproyecto where n_idgen_tipoproyecto=' + n_idgen_tipoproyecto + ';';
        }
    
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

module.exports = {
    get,
    save,
    delete_tipoproyecto
}
