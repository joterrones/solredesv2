const cnx = require('../common/appsettings')
const valida = require('../common/validatoken');
let pool = cnx.pool;

const getversion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_fase = request.body.n_idgen_fase;
        pool.query('select n_idgen_version,n_idgen_proyecto,c_descripcion,n_version,v.n_idgen_fase, f.c_nombre c_fase from gen_version v ' +
            'inner join gen_fase f on v.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 ' +
            'where v.n_borrado = 0 and v.n_idgen_proyecto = $1 and (f.n_idgen_fase = $2 or 0 = $2)'
            , [n_idgen_proyecto, n_idgen_fase],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getprograma = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_version = request.body.n_idgen_version;
        pool.query('select n_idgen_programa,n_idgen_version,n_orden,n_mes,n_anio,n_monto from gen_programa where n_borrado = 0 and n_idgen_version = $1', [n_idgen_version],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
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
        let n_idgen_version = request.body.n_idgen_version;
        let c_descripcion = request.body.c_descripcion;
        let n_version = request.body.n_version;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_fase = request.body.n_idgen_fase;
        let cadena = '';

        if (n_idgen_version == 0) {
            cadena = 'insert into gen_version(n_idgen_version,n_idgen_proyecto,c_descripcion,n_version,n_idgen_fase,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_proyecto + ',\'' + c_descripcion + '\',' + n_version + ',' + n_idgen_fase + ',0,now(),1) returning *;';
        } else {
            cadena = 'update gen_version set ' +
                'c_descripcion= \'' + c_descripcion + '\'' +
                ',n_version= ' + n_version + ' ' +
                ',n_idgen_fase= ' + n_idgen_fase + ' ' +
                ',n_idgen_proyecto= ' + n_idgen_proyecto + ' ' +
                ' where n_idgen_version=' + n_idgen_version + ' returning *;';
        }
        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {

                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveprograma = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_programa = request.body.n_idgen_programa;
        let n_idgen_version = request.body.n_idgen_version;
        let n_orden = request.body.n_orden;
        let n_mes = request.body.n_mes;
        let n_anio = request.body.n_anio;
        let n_monto = request.body.n_monto;

        let cadena = '';

        if (n_idgen_programa == 0) {
            cadena = 'insert into gen_programa(n_idgen_programa,n_idgen_version,n_orden,n_mes,n_anio,n_monto,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_version + ',' + n_orden + ',' + n_mes + ',' + n_anio + ',' + n_monto + ',0,now(),1) returning *;';
        } else {
            cadena = 'update gen_programa set ' +
                'n_idgen_version= ' + n_idgen_version +
                ',n_orden= ' + n_orden +
                ',n_mes= ' + n_mes +
                ',n_anio= ' + n_anio +
                ',n_monto= ' + n_monto +
                ' where n_idgen_programa=' + n_idgen_programa + ' returning *;';
        }

        pool.query(cadena,
            (error, results) => {
                if (error) {

                    console.log(cadena);
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const copiar = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_version = request.body.n_idgen_version;
        let n_idgen_versioncopy = request.body.n_idgen_versioncopy;

        pool.query('insert into gen_programa(n_idgen_version,n_orden,n_mes,n_anio,n_monto,n_borrado,n_id_usercrea,d_fechacrea) \n\r' +
            'select $1,n_orden,n_mes,n_anio,n_monto,0,1,now() from gen_programa where n_borrado = 0 and n_idgen_version = $2;', [n_idgen_version, n_idgen_versioncopy],
            (error, results) => {
                if (error) {

                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deleteversion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_version = request.body.n_idgen_version;
        let cadena = '';

        cadena = 'update gen_version set ' +
            'n_borrado= n_idgen_version ' +
            ' where n_idgen_version=' + n_idgen_version + ' returning *;';

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const deleteprograma = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_programa = request.body.n_idgen_programa;
        let cadena = '';

        cadena = 'update gen_programa set ' +
            'n_borrado= n_idgen_programa ' +
            ' where n_idgen_programa=' + n_idgen_programa + ' returning *;';

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

module.exports = {
    getversion,
    getprograma,
    save,
    deleteversion,
    saveprograma,
    deleteprograma,
    copiar
}
