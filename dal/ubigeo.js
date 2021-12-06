const cnx = require('../common/appsettings')
const valida = require('../common/validatoken');
const { result } = require('lodash');
let pool = cnx.pool;

const get_ubigeoproyecto_fase = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        pool.query('select n_idgen_fase, c_nombre from gen_fase where n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_ubigeoproyecto = (request, response) => {
    var obj = valida.validaToken(request)


    if (obj.estado) {
        pool.query('select ' +
            'u.n_idgen_departamento, ' +
            'u.c_departamento, ' +
            'u.n_idgen_provincia,  ' +
            'u.c_provincia,  ' +
            'u.n_idgen_distrito, ' +
            'u.c_distrito,     ' +
            'u.n_idgen_centropoblado,   ' +
            'u.c_centropoblado,  ' +
            'coalesce(p.n_idpro_cpproyecto,0) n_idpro_cpproyecto,  ' +
            'case when p.n_idpro_cpproyecto is null then false else true end b_flag  ' +
            'from vw_ubigeo u ' +
            'left outer join pro_cpproyecto p on u.n_idgen_centropoblado = p.n_idgen_centropoblado and p.n_borrado = 0 and p.n_idgen_proyecto=$4 and p.n_idgen_fase=$5 ' +
            'where (n_idgen_departamento = $1 or 0 = $1) and(n_idgen_provincia = $2 or 0 = $2) and (n_idgen_distrito = $3 or 0 = $3) order by p.n_idpro_cpproyecto  ',
            [request.body.n_idgen_departamento, request.body.n_idgen_provincia, request.body.n_idgen_distrito, request.body.n_idgen_proyecto, request.body.n_idgen_fase],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const get_ubigeobolsaproyecto = (request, response) => {
    var obj = valida.validaToken(request)

    if (obj.estado) {
        pool.query('select ' +
            'u.n_idgen_departamento, ' +
            'u.c_departamento, ' +
            'u.n_idgen_provincia,  ' +
            'u.c_provincia,  ' +
            'u.n_idgen_distrito, ' +
            'u.c_distrito,     ' +
            'u.n_idgen_centropoblado,   ' +
            'u.c_centropoblado,  ' +
            'coalesce(p.n_idpro_cpbolsaproyecto,0) n_idpro_cpbolsaproyecto,  ' +
            'case when p.n_idpro_cpbolsaproyecto is null then false else true end b_flag  ' +
            'from vw_ubigeo u ' +
            'left outer join pro_cpbolsaproyecto p on u.n_idgen_centropoblado = p.n_idgen_centropoblado and p.n_borrado = 0 and p.n_idgen_bolsaproyecto=$4 ' +
            'where (n_idgen_departamento = $1 or 0 = $1) and(n_idgen_provincia = $2 or 0 = $2) and (n_idgen_distrito = $3 or 0 = $3) ',
            [request.body.n_idgen_departamento, request.body.n_idgen_provincia, request.body.n_idgen_distrito, request.body.n_idgen_bolsaproyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_departamento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_departamento, u.c_departamento c_nombre from vw_ubigeo u \n\r' +
            'group by \n\r' +
            'u.n_idgen_departamento, \n\r' +
            'u.c_departamento \n\r' +
            'order by c_departamento ',
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

const get_provincia = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_provincia, u.c_provincia c_nombre from vw_ubigeo u \n\r' +
            'where (n_idgen_departamento = $1 or 0 = $1) \n\r' +
            'group by \n\r' +
            'u.n_idgen_provincia, \n\r' +
            'u.c_provincia \n\r' +
            'order by c_provincia ', [request.body.n_idgen_departamento],
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

const get_distrito = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_distrito, u.c_distrito c_nombre from vw_ubigeo u \n\r' +
            'where (n_idgen_departamento = $1 or 0 = $1) and (n_idgen_provincia = $2 or 0 = $2) \n\r' +
            'group by \n\r' +
            'u.n_idgen_distrito, \n\r' +
            'u.c_distrito \n\r' +
            'order by c_distrito ',
            [request.body.n_idgen_departamento, request.body.n_idgen_provincia],
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

const get_centropoblado = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        pool.query('select u.n_idgen_centropoblado, u.c_centropoblado c_nombre from vw_ubigeo u \n\r' +
            'where (n_idgen_departamento = $1 or 0 = $1) and (n_idgen_provincia = $2 or 0 = $2) and (n_idgen_distrito = $3 or 0 = $3)  \n\r' +
            'group by \n\r' +
            'u.n_idgen_centropoblado, \n\r' +
            'u.c_centropoblado \n\r' +
            'order by c_centropoblado',
            [request.body.n_idgen_departamento, request.body.n_idgen_provincia, request.body.n_idgen_distrito],
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

const save_proyectoubicacion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idpro_cpproyecto = request.body.n_idpro_cpproyecto;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
        let n_idgen_fase = request.body.n_idgen_fase;
        let cadena = '';
        if (n_idpro_cpproyecto == 0) {
            cadena = 'insert into pro_cpproyecto(n_idpro_cpproyecto,n_idgen_proyecto,n_idgen_centropoblado,n_idgen_fase,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_proyecto + ',' + n_idgen_centropoblado + ',' + n_idgen_fase + ',0,now(),1);';
        } else {
            cadena = 'update  pro_cpproyecto set n_borrado =n_idpro_cpproyecto where n_idpro_cpproyecto =' + n_idpro_cpproyecto;

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

const save_proyectoubicacion_import = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        resultado = [];
        let datos = request.body.datos;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_fase = request.body.n_idgen_fase;
        let i = 0;
        console.log(datos.length);
        datos.forEach(element => {
            let Departamento = element.Departamento;
            let Provincia = element.Provincia;
            let Distrito = element.Distrito;
            let Localidad = element.Localidad;

            pool.query('select * from fn_inserta_proyectolocalidad_xlsx($1,$2,$3,$4,$5,$6)', [Departamento, Provincia, Distrito, Localidad, n_idgen_proyecto, n_idgen_fase],
                (error, results) => {
                    if (error) {
                        console.log(error);
                        resultado.push(
                            {
                                Departamento: Departamento,
                                Provincia: Provincia,
                                Distrito: Distrito,
                                Localidad: Localidad,
                                Insertado: false,
                                Mensaje: "Error: "+ error.stack
                            }
                        )
                    } else {
                        resultado.push(
                            {
                                Departamento: Departamento,
                                Provincia: Provincia,
                                Distrito: Distrito,
                                Localidad: Localidad,
                                Insertado: results.rows[0].b_flag,
                                Mensaje: results.rows[0].c_mensaje
                            }
                        )
                    }
                    i++;
                    console.log(i);
                    if (datos.length == i) {
                        console.log("respuesta")
                        response.status(200).json({ estado: true, mensaje: "", data: resultado })
                    }
                })
      
           
        });
    } else {
        response.status(200).json(obj)
    }
}


const save_bolsaproyectoubicacion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idpro_cpbolsaproyecto = request.body.n_idpro_cpbolsaproyecto;
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;

        let cadena = '';
        if (n_idpro_cpbolsaproyecto == 0) {
            cadena = 'insert into pro_cpbolsaproyecto(n_idpro_cpbolsaproyecto,n_idgen_bolsaproyecto,n_idgen_centropoblado,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_bolsaproyecto + ',' + n_idgen_centropoblado + ',0,now(),1);';
        } else {
            cadena = 'update  pro_cpbolsaproyecto set n_borrado =n_idpro_cpbolsaproyecto where n_idpro_cpbolsaproyecto =' + n_idpro_cpbolsaproyecto;

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

module.exports = {
    save_proyectoubicacion,
    get_ubigeoproyecto,
    get_departamento,
    get_provincia,
    get_distrito,
    get_centropoblado,
    get_ubigeoproyecto_fase,
    get_ubigeobolsaproyecto,
    save_bolsaproyectoubicacion,
    save_proyectoubicacion_import

}
