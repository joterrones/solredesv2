
const cnx = require('../common/appsettings');
const fs = require('fs');
let pool = cnx.poolLocal;

const guardarfoto = (request, response) => {
    try {
        let proyecto = request.query.proyecto;
        let base64Str = request.body.c_file.replace("\/", "/");
        var base64Data = base64Str.replace(/^data:image\/png;base64,/, "");
        let dir = "D:/fotos/inspeccion/" + proyecto + "/";
        let patshort = request.body.c_nombre.substr(0, 2);

        dir = dir + patshort;
        console.log(dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let flag = true;
        fs.writeFile(dir + '/' + request.body.c_nombre, base64Data, 'base64', function (err) {
            console.log(err);
            if (err) {
                response.status(200).json({ c_nombre: request.body.c_nombre, b_flag: false, c_mensaje: "Error al guardar la foto" })
            } else {
                response.status(200).json({ c_nombre: request.body.c_nombre, b_flag: true, c_mensaje: "Correcto" })
            }
        });
    } catch (e) {
        response.status(200).json({ c_nombre: request.body.c_nombre, b_flag: false, c_mensaje: "Error al guardar la foto:" + e.stack })
    }
}

const guardardatos = async (request, response) => {
    pool = cnx.dynamic_connection(request.query.proyecto);
    let inspecciones = request.body.inspecciones;
    let resultados = [];
    let cadena_inspeccion = '';
    let resultado;
    await inspecciones.forEach(async element => {
        try {
            let queryExisteInspeccion = await pool.query('Select n_idmon_inspeccion from mon_inspeccion where c_codigo = $1 and n_borrado=0', [element.c_codigo]);
            if (queryExisteInspeccion.rowCount == 0) {
                cadena_inspeccion = 'insert into mon_inspeccion(n_idmon_inspeccion,c_codigo,c_latitud,c_longitud,n_precision,n_altitud,d_fecha,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                    '(default,\'' + element.c_codigo + '\',\'' + element.c_latitud + '\',\'' + element.c_longitud + '\',' + element.n_precision + ',' + element.n_altitud + ',to_timestamp(\'' + element.d_fecha + '\',\'yyyy/mm/dd HH24:MI:SS\'),0,' + element.n_id_usuario + ',now()) returning *';
                let insertInspeccion = await pool.query(cadena_inspeccion);
                if (insertInspeccion.rowCount > 0) {
                    if (element.vanos.length > 0) {
                        let cadena_vano = 'insert into mon_inspeccionvano(n_idmon_inspeccionvano,c_codigoinicio,c_codigofin,n_borrado,n_id_usercrea,d_fechacrea) values ';
                        element.vanos.forEach(vano => {
                            cadena_vano = cadena_vano + '(default,\'' + vano.c_codigoinicio + '\',\'' + vano.c_codigofin + '\'' + ',0,' + element.n_id_usuario + ',now()),';
                        });
                        cadena_vano = cadena_vano.substr(0, cadena_vano.length - 1) + ' returning *';
                        await pool.query(cadena_vano)
                    }
                    if (element.detalles.length > 0) {
                        let cadena_detalle = '';
                        await element.detalles.forEach(async detalle => {
                            cadena_detalle = 'insert into mon_inspecciondetalle(n_idmon_inspecciondetalle,n_idmon_inspeccion,n_idpl_armado,n_cantidad,b_adicional,b_eliminado,c_observacion,n_orientacion,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                                '(default,' + insertInspeccion.rows[0].n_idmon_inspeccion + ',' + detalle.n_idpl_armado + ',' + detalle.n_cantidad + ',' + detalle.b_adicional + ',' + detalle.b_eliminado + ',\'' + detalle.c_observacion + '\',' + detalle.n_orientacion + ',0,' + element.n_id_usuario + ',now()) returning *';
                            let insertDetalle = await pool.query(cadena_detalle);
                            if (detalle.observaciones.length > 0) {
                                let cadena_observacion = 'insert into mon_inspeccionobservacion(n_idmon_inspeccionobservacion,n_idmon_inspecciondetalle,n_idgen_observacion,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                detalle.observaciones.forEach(observacion => {
                                    cadena_observacion = cadena_observacion + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',' + observacion.n_idgen_observacion + ',0,' + element.n_id_usuario + ',now()),';
                                });
                                cadena_observacion = cadena_observacion.substr(0, cadena_observacion.length - 1) + ' returning *';
                                let insertObservacion = await pool.query(cadena_observacion)
                            }
                            if (detalle.fotos.length > 0) {
                                let cadena_fotos = 'insert into mon_inspeccionfoto(n_idmon_inspeccionfoto,n_idmon_inspecciondetalle,c_nombre,n_idgen_tipofoto,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                detalle.fotos.forEach(foto => {
                                    cadena_fotos = cadena_fotos + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',\'' + foto.c_nombre + '\',' + foto.n_idgen_tipofoto + ',0,' + element.n_id_usuario + ',now()),';
                                });
                                cadena_fotos = cadena_fotos.substr(0, cadena_fotos.length - 1) + ' returning *';
                                let insertFoto = await pool.query(cadena_fotos);
                            }
                        });
                    }
                    resultado = {
                        c_codigo: element.c_codigo,
                        b_flag: true,
                        c_mensaje: "Registro guardado"
                    };
                }
            } else {
                resultado = {
                    c_codigo: element.c_codigo,
                    b_flag: true,
                    c_mensaje: "El registro ya existe"
                };
                resultados.push(resultado);
            }
        } catch (error) {
            resultado = {
                c_codigo: element.c_codigo,
                b_flag: true,
                c_mensaje: "Ocurrio un error al insertar los datos de inspeccion!." + error.stack
            };
        }
    });
    resultados.push(resultado);
    //if (inspecciones.length == resultados.length) {
    response.status(200).json(resultados);
    // }
}



const getusuario = (request, response) => {
    pool.query('select n_idseg_userprofile n_ID_Usuario,c_username c_Usuario,c_nombre1 c_Nombre1,coalesce(c_nombre2,\'\') c_Nombre2,c_appaterno c_ApPaterno,c_apmaterno c_ApMaterno,c_nombre1||	\' \'||c_appaterno||\' \'||c_apmaterno c_NombreCompleto,c_clave c_PasswordMovil from seg_userprofile where n_borrado = 0', (error, results) => {
        if (error) {
            response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del armado!.", data: null })
        } else {
            response.status(200).json(results.rows)
        }
    })
}

const getlinea = (request, response) => {
    lineas = [];
    tipoarmados = [];
    armados = [];
    fotos = [];
    observaciones = [];

    pool.query('Select l.n_idpl_linea, l.c_codigo, l.c_nombre, l.n_idpl_tipolinea, l.n_idpl_zona,false b_flag from pl_linea l ' +
        'inner join rep_usuariolinea ul on l.n_idpl_linea=ul.n_idpl_linea and ul.n_borrado = 0 ' +
        'where l.n_borrado = 0 ' +
        'and ul.n_idseg_userprofile = $1', [request.query.n_idseg_userprofile], (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la linea!." + error.stack, data: null })
            } else {
                lineas = results.rows;
                pool.query('select n_idpl_tipoarmado,c_codigo,c_nombre, coalesce(b_angulo,false) b_angulo, coalesce(n_orden,0) n_orden from pl_tipoarmado ta ' +
                    'where n_borrado = 0 ' +
                    'and b_movil = true', (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la linea!." + error.stack, data: null })
                        } else {
                            tipoarmados = results.rows;
                            pool.query('Select n_idpl_armado,n_idpl_tipoarmado,c_codigo,c_nombre, coalesce(c_iconomapa,\'\') c_iconomapa from pl_armado a ' +
                                'where a.n_borrado = 0 and n_version = 4', (error, results) => {
                                    if (error) {
                                        response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la linea!." + error.stack, data: null })
                                    } else {
                                        armados = results.rows;
                                        pool.query('select n_idgen_tipofoto,c_codigo,c_nombre,n_tipo,coalesce(b_foto, false)b_foto,coalesce(b_requerido,false)b_requerido from gen_tipofoto ' +
                                            'where n_tipo=10', (error, results) => {
                                                if (error) {
                                                    response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la linea!." + error.stack, data: null })
                                                } else {
                                                    fotos = results.rows;
                                                    pool.query('select n_idgen_observacion,c_codigo,c_descripcion,n_idpl_tipoarmado from gen_observacion ' +
                                                        'where n_borrado = 0', (error, results) => {
                                                            if (error) {
                                                                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la linea!." + error.stack, data: null })
                                                            } else {
                                                                observaciones = results.rows;
                                                                response.status(200).json({ lineas: lineas, tipoarmados: tipoarmados, armados: armados, fotos: fotos, observaciones: observaciones })
                                                            }
                                                        })
                                                }
                                            })

                                    }
                                })
                        }
                    })
            }
        })
}

const getdato = (request, response) => {
    let estructuras = [];
    let subtramos = [];
    let estructurasdetalle = [];
    pool.query('Select distinct p.n_idpl_Estructura,p.n_idpl_linea,p.c_codigoestructura c_codigo, p.c_codigoestructura c_nombre,p.c_latitud,p.c_longitud,p.c_etiquetaestructura c_etiqueta,p.c_codigonodo,p.c_codigotipolinea from vw_planos p ' +
        'inner join rep_usuariolinea ul on p.n_idpl_linea=ul.n_idpl_linea and ul.n_borrado = 0 ' +
        'where ul.n_idseg_userprofile = $1 ' +
        'and p.n_idpl_linea = $2 ' +
        'and p.n_version = (Select max(n_version) from pl_Estructura where n_version < 20)', [request.query.n_id_usuario, request.query.n_idpl_linea], (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la  estructura!." + error.stack, data: null })
            } else {
                estructuras = results.rows;
                pool.query('Select distinct st.n_idpl_estructurainicio,st.n_idpl_estructurafin,st.c_etiqueta,p.n_idpl_tipolinea,p.n_idpl_linea,p.c_codigotipolinea from vw_planos p ' +
                    'inner join pl_subtramo st on p.n_idpl_estructura = st.n_idpl_estructurainicio and st.n_borrado = 0 ' +
                    'inner join rep_usuariolinea ul on p.n_idpl_linea=ul.n_idpl_linea and ul.n_borrado = 0 ' +
                    'where ul.n_idseg_userprofile = $1 ' +
                    'and p.n_idpl_linea = $2 ' +
                    'and p.n_version = (Select max(n_version) from pl_Estructura where n_version < 20)', [request.query.n_id_usuario, request.query.n_idpl_linea], (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la  subtramo!." + error.stack, data: null })
                        } else {
                            subtramos = results.rows;
                            pool.query('Select distinct p.n_idpl_estructura,a.n_idpl_armado,a.c_codigo c_codigoarmado,a.c_iconomapa, coalesce(ea.n_orientacion,0) n_orientacion,p.n_idpl_linea, ta.c_codigo c_codigotipoarmado, ea.n_cantidad from vw_planos p ' +
                                'inner join pl_estructuraarmado ea on p.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0 ' +
                                'inner join pl_armado a on ea.n_idpl_armado = a.n_idpl_armado and a.n_borrado = 0 ' +
                                'inner join pl_tipoarmado ta on a.n_idpl_tipoarmado = ta.n_idpl_tipoarmado and ta.n_borrado = 0 ' +
                                'inner join rep_usuariolinea ul on p.n_idpl_linea=ul.n_idpl_linea and ul.n_borrado = 0 ' +
                                'where ul.n_idseg_userprofile = $1 ' +
                                'and p.n_idpl_linea = $2 ' +
                                'and p.n_version = (Select max(n_version) from pl_Estructura where n_version < 20) ' +
                                'and (a.c_iconomapa is not null or a.c_iconomapa !=\'-\' or a.c_iconomapa !=\'\')', [request.query.n_id_usuario, request.query.n_idpl_linea], (error, results) => {
                                    if (error) {
                                        response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de la  subtramo!." + error.stack, data: null })
                                    } else {
                                        estructurasdetalle = results.rows;

                                        response.status(200).json({ estructuras: estructuras, subtramos: subtramos, estructuradetalles: estructurasdetalle })
                                    }
                                })
                        }
                    })
            }
        })

}


module.exports = {
    getusuario,
    getlinea,
    getdato,
    guardardatos,
    guardarfoto

}