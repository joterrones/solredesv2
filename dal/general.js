const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;


const get = (request, response) => {
    var obj = valida.validaToken(request)    
    if (obj.estado) {
        pool.query('select n_idgen_entidad,c_name from gen_entidad where n_borrado = 0',
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



const get_feriado = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_diaferiado,n_dia,n_mes,n_anio from gen_diaferiado where n_borrado =  0',
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


const getdepartamento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idgen_departamento, c_nombre from gen_departamento where n_borrado = 0',
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

const getprovincia = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_departamento  = request.body.n_idgen_departamento;
        pool.query('Select n_idgen_departamento, n_idgen_provincia, c_nombre from gen_provincia where n_borrado = 0 and (n_idgen_departamento = $1 or 0 = $1)',[n_idgen_departamento],
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

const getdistrito = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_provincia  = request.body.n_idgen_provincia;
        pool.query('Select n_idgen_provincia,n_idgen_distrito, c_nombre from gen_distrito where n_borrado = 0 and (n_idgen_provincia = $1 or 0 = $1)',[n_idgen_provincia],
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

const getcentropoblado = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_distrito  = request.body.n_idgen_distrito;
        pool.query('Select n_idgen_distrito, n_idgen_centropoblado, c_nombre from gen_centropoblado where n_borrado = 0 and (n_idgen_distrito = $1 or 0 = $1)',[n_idgen_distrito],
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


const save_feriado = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let  n_anio=request.body.n_anio;
        let  n_mes=request.body.n_mes;
        let  n_dia=request.body.n_dia;
        let cadena = 'do $$ \n\r' +
        '   begin \n\r' +
        '       if(exists(select n_idgen_diaferiado from gen_diaferiado where n_borrado = 0 and n_anio =\''+n_anio+'\' and n_mes = '+n_mes+' and n_dia= '+n_dia+')) then \n\r' +
        '           update gen_diaferiado set n_borrado=n_idgen_diaferiado   where n_borrado = 0 and n_anio ='+n_anio+' and n_mes = '+n_mes+' and n_dia= '+n_dia+'; \n\r' +
        '       else \n\r' +
        '           insert into gen_diaferiado (n_idgen_diaferiado,n_anio,n_mes,n_dia,n_borrado,d_fechacrea,n_id_usercrea) values(default,'+n_anio+','+n_mes+','+n_dia+',0,now(),1); \n\r' +
        '       end if; \n\r' +
        '   end \n\r' +
        '$$';
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(cadena);
                    response.status(200).json({ estado: false, mensaje: "DB: error!."+ error.stack, data: null })
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

        let  c_name=request.body.c_name;

        let cadena = 'do $$ \n\r' +
        '   begin \n\r' +
        '       if(exists(select n_idgen_entidad from gen_entidad where n_borrado = 0 and c_name =\''+c_name+'\')) then \n\r' +
        '           update gen_entidad set c_name= \''+c_name+'\' where c_name=\''+c_name+'\'; \n\r' +
        '       else \n\r' +
        '           insert into gen_entidad(n_idgen_entidad,c_name,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
        '           values (default,\''+c_name+'\',0,now(),1); \n\r' +
        '       end if; \n\r' +
        '   end \n\r' +
        '$$';

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

module.exports = {
   
    get,
    save,
    get_feriado,
    save_feriado,
    getdepartamento,
    getprovincia,
    getdistrito,
    getcentropoblado
}

//CD