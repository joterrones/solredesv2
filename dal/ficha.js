const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;


const get = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let cadena = 'select ins.c_codigo, ins.c_latitud, ins.c_longitud, ins.n_precision, ins.n_altitud, ins.d_fecha, ins.n_id_usercrea,	ins.n_idpl_linea, ins.n_idpl_linea,ins.c_codigoestructura, ins.c_codigoede,'+	
            'us.c_username, us.c_nombre1, us.c_nombre2, us.c_appaterno, us.c_apmaterno, '+
            'pl.c_nombre, tf.c_nombre as nfoto, '+
            'plar.c_codigo as c_codigoarmado, plar.c_nombre as c_nombrearmado, det.n_cantidad, det.n_orientacion, det.c_observacion, det.c_rutafoto, gobs.c_descripcion as c_observacion2 '+
            'from mon_inspeccion ins \n\r' +
            'inner join seg_userprofile us on us.n_idseg_userprofile = ins.n_id_usercrea \n\r' +    
            'inner join pl_linea pl on pl.n_idpl_linea = ins.n_idpl_linea \n\r' +         
            'left join mon_inspecciondetalle det on det.n_idmon_inspeccion = ins.n_idmon_inspeccion \n\r' +    
            'left join pl_armado plar on plar.n_idpl_armado = det.n_idpl_armado \n\r' +  
            'left join mon_inspecciondetallefoto dfot on dfot.n_idmon_inspecciondetalle = det.n_idmon_inspecciondetalle \n\r' +    
            'left join gen_tipofoto tf on tf.n_idgen_tipofoto = dfot.n_idgen_tipofoto \n\r' +    
            'left join mon_inspeccionobservacion mobs on mobs.n_idmon_inspecciondetalle = det.n_idmon_inspecciondetalle \n\r' +    
            'left join gen_observacion gobs on gobs.n_idgen_observacion = mobs.n_idgen_observacion \n\r' +    
            'where ins.c_codigo = $1 and ins.n_borrado = 0'
        pool.query(cadena,
            [request.body.c_codigo],
            (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })    
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}



module.exports = {
    get
}