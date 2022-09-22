const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;


const getReporteCabecero = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
    if (obj.estado) {
        pool.query('select cab.n_idctrl_cabecerareporteavance, cab.n_idgen_zona, cab.d_fechacorte, pl.c_nombre, f.c_descripcion, f.n_idgen_periodo \n\r'+
        'from ctrl_cabecerareporteavance cab \n\r'+
        'inner join gen_periodo as f \n\r'+
        'ON cab.n_idge_periodo = f.n_idgen_periodo \n\r'+
        'inner join  pl_zona as pl \n\r'+
        'ON cab.n_idgen_zona = pl.n_idpl_zona \n\r'+
        'where pl.n_idpro_proyecto = '+ n_idpl_tipolinea + ' and cab.n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getReporte = (request, response) => {
    let idzona = request.body.n_idpl_tipolinea;
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idctrl_reporteavance, c_seccion ,c_tipo, n_metrado_contractual, n_metrado_replanteo, n_llegado_obra, n_cantidadesposteizado from ctrl_reporteavance where n_idctrl_cabecerareporteavance = '+idzona + ' and n_borrado = 0 order by n_idctrl_reporteavance ASC',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getZonasProyectos = (request, response) => {
    let idzona = request.body.n_idpl_tipolinea;
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select * from pl_zona where n_idpro_proyecto = '+idzona +' and n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getPeriodos = (request, response) => {
    let idzona = request.body.n_idpl_tipolinea;
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_periodo, c_descripcion from gen_periodo where n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveReporteCabecero = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let anio = request.body.n_idgen_periodo;
        let n_idpl_zona = request.body.n_idgen_zona; 
        let fecha = request.body.d_fechacorte;                                    
        let n_idctrl_cabecerareporteavance = request.body.n_idctrl_cabecerareporteavance;
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idctrl_cabecerareporteavance from ctrl_cabecerareporteavance where n_borrado = 0 and n_idctrl_cabecerareporteavance =\'' + n_idctrl_cabecerareporteavance + '\')) then \n\r' +
            '           update ctrl_cabecerareporteavance set n_idge_periodo = \'' + anio + '\', n_idgen_zona=\''+ n_idpl_zona +'\', d_fechacorte=\''+ fecha +'\' , n_id_usermodi='+n_id_usermodi+', d_fechamodi= now()  \n\r' +
            '                  where n_idctrl_cabecerareporteavance =\'' + n_idctrl_cabecerareporteavance + '\'; \n\r' +
            '       else \n\r' +
            '           insert into ctrl_cabecerareporteavance(n_idctrl_cabecerareporteavance, n_idge_periodo, n_idgen_zona, d_fechacorte, n_borrado, d_fechacrea, n_id_usercrea)\n\r' +
            '           values (default,\'' + anio + '\',\''+ n_idpl_zona +'\', \''+ fecha+'\', 0, now(), '+n_id_usermodi+');\n\r' +
            '       end if; \n\r' +
            '   end \n\r' +
            '$$';

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error3!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deleteReporteCabecero = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_id_usermodi = request.body.n_id_usermodi;
        let n_idctrl_cabecerareporteavance = request.body.n_idctrl_cabecerareporteavance;
        pool.query('update ctrl_cabecerareporteavance set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idctrl_cabecerareporteavance=' + n_idctrl_cabecerareporteavance + ' ',
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

const saveReporte = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let c_tipo = request.body.c_tipo
        let metradocontractual = request.body.n_metrado_contractual                
        let metradoreplanteo = request.body.n_metrado_replanteo
        let llegado = request.body.n_llegado_obra
        let cantidades = request.body.n_cantidadesposteizado
        let seccion = request.body.c_seccion
        let n_idctrl_reporteavance = request.body.n_idctrl_reporteavance;
        let encabezado = request.body.n_idctrl_cabeceroreporteavance;
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idctrl_reporteavance from ctrl_reporteavance where n_borrado = 0 and n_idctrl_reporteavance =\'' + n_idctrl_reporteavance + '\')) then \n\r' +
            '           update ctrl_reporteavance set c_tipo= \'' + c_tipo + '\', n_metrado_contractual=\' '+ metradocontractual +'\', n_metrado_replanteo=\''+ metradoreplanteo +'\', n_llegado_obra=\''+ llegado +'\', n_cantidadesposteizado=\''+ cantidades +'\' , c_seccion=\''+ seccion +'\' , n_id_usermodi=\''+n_id_usermodi +'\', d_fechamodi= now()  \n\r' +
            '                  where n_idctrl_reporteavance =\'' + n_idctrl_reporteavance + '\'; \n\r' +
            '       else \n\r' +
            '           insert into ctrl_reporteavance(n_idctrl_reporteavance, c_tipo, n_metrado_contractual,n_metrado_replanteo, n_llegado_obra, n_cantidadesposteizado, c_seccion, n_idctrl_cabecerareporteavance,n_borrado, d_fechacrea, n_id_usercrea)\n\r' +
            '           values (default,\'' + c_tipo + '\',\'' + metradocontractual + '\',\''+ metradoreplanteo +'\', \''+ llegado + '\', \''+cantidades + '\', \''+seccion + '\',\''+ encabezado +'\', 0, now(), '+n_id_usermodi+');\n\r' +
            '       end if; \n\r' +
            '   end \n\r' +
            '$$';

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error3!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deleteReporte = (request, response) => {
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idctrl_reporteavance = request.body.n_idctrl_reporteavance;
    if (obj.estado) {
        pool.query('update ctrl_reporteavance set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idctrl_reporteavance=' + n_idctrl_reporteavance + ' ',
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


module.exports = {
    getReporte,
    getReporteCabecero,
    getZonasProyectos,
    saveReporteCabecero,
    deleteReporteCabecero,
    saveReporte,
    deleteReporte,
    getPeriodos

}