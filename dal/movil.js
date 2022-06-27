
const cnx = require('../common/appsettings')
const fs = require('fs');
let pool = cnx.pool;
const ruta = '/archivos';
const guardarfoto = (request, response) => {
    try {
        let proyecto = request.query.proyecto;
        let base64Str = request.body.c_file.replace("\/", "/");
        var base64Data = base64Str.replace(/^data:image\/png;base64,/, "");
        let dir = __dirname.replace('\dal', '') + ruta + "/inspeccion/";
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

const guardarfotoalmacen = (request, response) => {
    try {
        let proyecto = request.query.proyecto;
        let base64Str = request.body.c_file.replace("\/", "/");
        var base64Data = base64Str.replace(/^data:image\/png;base64,/, "");
        let dir = __dirname.replace('\dal', '') + ruta + "/almacen/";
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
    console.log("request.body", request.body);
    let inspecciones = request.body.inspecciones;
    console.log("inspecciones", inspecciones);
    let resultados = [];
    let cadena_inspeccion = '';
    let resultado;
    inspecciones.forEach(async element => {
        try {
            let queryExisteInspeccion = await pool.query('Select n_idmon_inspeccion from mon_inspeccion where c_codigo = $1 and n_borrado=0', [element.c_codigo]);
            if (queryExisteInspeccion.rowCount == 0) {

                if (!element.n_altitud) {
                    element.n_altitud = 0;
                }

                if (!element.n_precision) {
                    element.n_precision = 0;
                }
                
                element.n_modulo= element.n_modulo===undefined?0:element.n_modulo;

                cadena_inspeccion = 'insert into mon_inspeccion(n_idmon_inspeccion,c_codigo,c_latitud,c_longitud,n_precision,n_altitud,d_fecha,n_idpl_linea,n_tipoapp,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                    '(default,\'' + element.c_codigo + '\',\'' + element.c_latitud + '\',\'' + element.c_longitud + '\',' + element.n_precision + ',' + element.n_altitud + ',to_timestamp(\'' + element.d_fecha + '\',\'yyyy/mm/dd HH24:MI:SS\'),'+element.n_idpl_linea+','+element.n_modulo+',0,' + element.n_id_usuario + ',now()) returning *';
                console.log("cadena_inspeccion", cadena_inspeccion);
                let insertInspeccion = await pool.query(cadena_inspeccion);
                if (insertInspeccion.rowCount > 0) {

                    if (element.vanos) {
                        if (element.vanos.length > 0) {
                            let cadena_vano = 'insert into mon_inspeccionvano(n_idmon_inspeccionvano,c_codigoinicio,c_codigofin,n_borrado,n_id_usercrea,d_fechacrea) values ';
                            element.vanos.forEach(vano => {
                                cadena_vano = cadena_vano + '(default,\'' + vano.c_codigoinicio + '\',\'' + vano.c_codigofin + '\'' + ',0,' + element.n_id_usuario + ',now()),';
                            });
                            cadena_vano = cadena_vano.substr(0, cadena_vano.length - 1) + ' returning *';
                            await pool.query(cadena_vano)
                        }
                    }

                    if (element.detallesInspeccion) {
                        if (element.detallesInspeccion.length > 0) {
                            let cadena_detalle = '';
                            await element.detallesInspeccion.forEach(async detalle => {
                                cadena_detalle = 'insert into mon_inspecciondetalle(n_idmon_inspecciondetalle,n_idmon_inspeccion,n_idpl_armado,n_cantidad,b_adicional,b_eliminado,c_observacion,n_orientacion,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                                    '(default,' + insertInspeccion.rows[0].n_idmon_inspeccion + ',' + detalle.n_idpl_armado + ',' + detalle.n_cantidad + ',' + detalle.b_adicional + ',' + detalle.b_eliminado + ',\'' + detalle.c_observacion + '\',' + detalle.n_orientacion + ',0,' + element.n_id_usuario + ',now()) returning *';
                                let insertDetalle = await pool.query(cadena_detalle);

                                if (detalle.observacionesInspeccion) {
                                    if (detalle.observacionesInspeccion.length > 0) {
                                        let cadena_observacion = 'insert into mon_inspeccionobservacion(n_idmon_inspeccionobservacion,n_idmon_inspecciondetalle,n_idgen_observacion,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                        detalle.observacionesInspeccion.forEach(observacion => {
                                            cadena_observacion = cadena_observacion + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',' + observacion.n_idgen_observacion + ',0,' + element.n_id_usuario + ',now()),';
                                        });
                                        cadena_observacion = cadena_observacion.substr(0, cadena_observacion.length - 1) + ' returning *';
                                        let insertObservacion = await pool.query(cadena_observacion)
                                    }
                                }

                                if (detalle.fotos) {
                                    if (detalle.fotos.length > 0) {
                                        let cadena_fotos = 'insert into mon_inspecciondetallefoto(n_idmon_inspecciondetallefoto,n_idmon_inspecciondetalle,c_nombre,n_idgen_tipofoto,b_estado,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                        detalle.fotos.forEach(foto => {
                                            cadena_fotos = cadena_fotos + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',\'' + foto.c_nombre + '\',' + foto.n_tipofoto + ',false,0,' + element.n_id_usuario + ',now()),';
                                        });
                                        cadena_fotos = cadena_fotos.substr(0, cadena_fotos.length - 1) + ' returning *';
                                        let insertFoto = await pool.query(cadena_fotos);
                                    }
                                }
                            });
                        }
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
                    b_flag: false,
                    c_mensaje: "El registro ya existe"
                };
            }
        } catch (error) {
            resultado = {
                c_codigo: element.c_codigo,
                b_flag: false,
                c_mensaje: "Ocurrio un error al insertar los datos de inspeccion!." + error.stack
            };
        }
        resultados.push(resultado);
        if (inspecciones.length <= resultados.length) {
            response.status(200).json({ inspecciones: resultados });
        }
    });

}

const guardardatosalmacen = async (request, response) => {
    console.log("request.body", request.body);
    let guias = request.body.guias;
    console.log("guardardatosalmacen", guias);
    let resultados = [];
    let cadena_guia = '';
    let resultado;
    guias.forEach(async element => {
        try {
            /* let queryExisteGuia = await pool.query('Select n_idalm_guia from alm_guia where c_codigo = $1 and n_borrado=0', [element.c_codigo]);
             if (queryExisteGuia.rowCount == 0) {*/

            if (!element.n_altitud) {
                element.n_altitud = 0;
            }

            if (!element.n_precision) {
                element.n_precision = 0;
            }

            cadena_guia = 'insert into alm_guia(n_idalm_guia,n_idalm_almacen,c_nombre,c_direccion,n_idgen_periodo,c_nroguia,c_ruc,c_observacion,b_aprobar,c_latitud,c_longitud,n_precision,n_altitud,d_fecha,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                '(default,'
                + element.n_idalm_almacen + ',\''
                + element.c_nombre + '\',\''
                + element.c_direccion + '\','
                + element.n_idgen_periodo + ',\''
                + element.c_nroguia + '\',\''
                + element.c_ruc + '\',\''
                + element.c_observacion
                + '\',false,\''
                + element.c_latitud + '\',\''
                + element.c_longitud + '\','
                + element.n_precision + ','
                + element.n_altitud
                + ',to_timestamp(\'' + element.d_fecha + '\',\'yyyy/mm/dd HH24:MI:SS\'),0,'
                + element.n_id_usuario
                + ',now()) returning *';

            console.log("cadena_guia", cadena_guia);
            let insertguia = await pool.query(cadena_guia);
            if (insertguia.rowCount > 0) {
                if (element.detalleguia != null && element.detallesguia.length > 0) {
                    let cadena_detallesguia = 'insert into alm_detalleguia(n_idalm_detalleguia,n_idalm_guia, n_idpl_elemento, n_cantidad ,n_borrado,n_id_usercrea,d_fechacrea) values ';
                    element.detallesguia.forEach(detalleguia => {
                        cadena_detallesguia = cadena_detallesguia + '(default,'
                            + insertguia.rows[0].n_idalm_guia + ','
                            + detalleguia.n_idpl_elemento + ','
                            + detalleguia.n_cantidad + ','
                            + ',0,'
                            + element.n_id_usuario
                            + ',now()),';
                    });
                    cadena_detallesguia = cadena_detallesguia.substr(0, cadena_detallesguia.length - 1) + ' returning *';
                    await pool.query(cadena_detallesguia)
                }
                resultado = {
                    c_codigo: element.c_codigo,
                    n_estado: 1,
                    c_mensaje: "Registro guardado"
                };
            }
            /*   } else {
                   resultado = {
                       c_codigo: element.c_codigo,
                       n_estado: 0,
                       c_mensaje: "El registro ya existe"
                   };
               }*/
        } catch (error) {
            resultado = {
                c_codigo: element.c_codigo,
                n_estado: 0,
                c_mensaje: "Ocurrio un error al insertar los datos del almacen!." + error.stack
            };
        }
        resultados.push(resultado);
        if (guias.length <= resultados.length) {
            response.status(200).json({ guias: resultados });
        }
    });

}

const getusuario = async (request, response) => {
    let queryUsuario = await pool.query('select n_idseg_userprofile n_ID_Usuario,c_username c_Usuario,c_nombre1 c_Nombre1,coalesce(c_nombre2,\'\') c_Nombre2,c_appaterno c_ApPaterno,c_apmaterno c_ApMaterno,c_nombre1||	\' \'||c_appaterno||\' \'||c_apmaterno c_NombreCompleto,c_clave c_PasswordMovil from seg_userprofile where n_borrado = 0');
    let queryProyecto = await pool.query('select p.n_idpro_proyecto, p.c_nombre, up.n_idseg_userprofile from pro_proyecto p ' +
        'inner join pro_usuarioproyecto up on p.n_idpro_proyecto = up.n_idpro_proyecto and up.n_borrado = 0 ' +
        'where p.n_borrado = 0');

    response.status(200).json({
        usuarios: queryUsuario.rows,
        proyectos: queryProyecto.rows
    })
}

const getlinea = async (request, response) => {
    try {


        let queryLinea = await pool.query('Select l.n_idpl_linea, l.c_codigo, l.c_nombre, l.n_idpl_tipolinea, l.n_idpl_zona,false b_flag from pl_linea l ' +
            'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0    ' +
            'inner join tra_grupolinea gl on l.n_idpl_linea=gl.n_idpl_linea and gl.n_borrado = 0 ' +
            'inner join tra_grupousuario gu on gl.n_idtra_grupo=gu.n_idtra_grupo and gu.n_borrado = 0 ' +
            'where l.n_borrado = 0 ' +
            'and gu.n_idseg_userprofile = $1 and z.n_idpro_proyecto = $2', [request.query.n_idseg_userprofile, request.query.n_idpro_proyecto]);

        let queryTipoArmado = await pool.query('select n_idpl_tipoarmado,c_codigo,c_nombre, coalesce(b_angulo,false) b_angulo, coalesce(n_orden,0) n_orden from pl_tipoarmado ta ' +
            'where n_borrado = 0 ' +
            'and b_movil = true');

        let queryArmado = await pool.query('Select n_idpl_armado,n_idpl_tipoarmado,c_codigo,c_nombre, coalesce(c_iconomapa,\'\') c_iconomapa from pl_armado a ' +
            'where a.n_borrado = 0 and n_version = 4  and n_idpro_proyecto = $1', [request.query.n_idpro_proyecto]);

        let queryTipoFoto = await pool.query('select n_idgen_tipofoto,c_codigo,c_nombre,n_tipo,coalesce(b_foto, false)b_foto,coalesce(b_requerido,false)b_requerido from gen_tipofoto ' +
            'where n_tipo=10');

        let queryObservacion = await pool.query('select n_idgen_observacion,c_codigo,c_descripcion,n_idpl_tipoarmado from gen_observacion ' +
            'where n_borrado = 0');

        let queryElemento = await pool.query('select e.n_idpl_elemento, e.c_codigo, e.c_nombre, e.n_precio, e.c_unidadmedida, e.n_idpl_tipoelemento, te.n_idpl_tipolinea, te.n_idpro_proyecto from pl_elemento e ' +
            'inner join pl_tipoelemento te on e.n_idpl_tipoelemento = te.n_idpl_tipoelemento and te.n_borrado = 0 ' +
            'where e.n_borrado = 0 and te.n_idpro_proyecto = $1', [request.query.n_idpro_proyecto]);

        let queryTipoElemento = await pool.query('select n_idpl_tipoelemento, c_codigo, c_nombre, n_idpl_tipolinea from pl_tipoelemento where n_borrado = 0 and n_idpro_proyecto = $1', [request.query.n_idpro_proyecto]);

        let queryAlmacen = await pool.query('select n_idalm_almacen, c_nombre,c_direccion from alm_almacen where n_borrado = 0 and n_idpro_proyecto = $1', [request.query.n_idpro_proyecto]);

        let queryPeriodo = await pool.query('select n_idgen_periodo,c_descripcion from gen_periodo where n_borrado = 0');

        let queryTipoLinea = await pool.query('select n_idpl_tipolinea, c_nombre from pl_tipolinea where n_borrado = 0');

        response.status(200).json({
            lineas: queryLinea.rows,
            tipoarmados: queryTipoArmado.rows,
            armados: queryArmado.rows,
            fotos: queryTipoFoto.rows,
            observaciones: queryObservacion.rows,
            elementos: queryElemento.rows,
            tiposElemento: queryTipoElemento.rows,
            almacenes: queryAlmacen.rows,
            periodos: queryPeriodo.rows,
            tiposLinea: queryTipoLinea.rows
        })

    } catch (error) {
        response.status(504).json({
            message: error.stack
        })
    }
}





const getdato = async (request, response) => {

    let queryEstructura = await pool.query('Select distinct p.n_idpl_Estructura,p.n_idpl_linea,p.c_codigoestructura c_codigo, p.c_codigoestructura c_nombre,p.c_latitud,p.c_longitud,p.c_etiquetaestructura c_etiqueta,p.c_codigonodo,p.c_codigotipolinea from vw_planos p ' +
        'inner join tra_grupolinea gl on p.n_idpl_linea=gl.n_idpl_linea and gl.n_borrado = 0 ' +
        'inner join tra_grupousuario gu on gl.n_idtra_grupo=gu.n_idtra_grupo and gu.n_borrado = 0 ' +
        'where gu.n_idseg_userprofile = $1 ' +
        'and p.n_idpl_linea = $2 ' +
        'and p.n_version = (Select max(n_version) from pl_Estructura where n_idpl_linea = $2) ' +
        'and p.n_version is not null', [request.query.n_id_usuario, request.query.n_idpl_linea]);

    let querySubtramo = await pool.query('Select distinct st.n_idpl_estructurainicio,st.n_idpl_estructurafin,st.c_etiqueta,p.n_idpl_tipolinea,p.n_idpl_linea,p.c_codigotipolinea from vw_planos p  ' +
        'inner join pl_subtramo st on p.n_idpl_estructura = st.n_idpl_estructurainicio and st.n_borrado = 0  ' +
        'inner join tra_grupolinea gl on p.n_idpl_linea=gl.n_idpl_linea and gl.n_borrado = 0  ' +
        'inner join tra_grupousuario gu on gl.n_idtra_grupo=gu.n_idtra_grupo and gu.n_borrado = 0  ' +
        'where gu.n_idseg_userprofile = $1   ' +
        'and p.n_idpl_linea = $2   ' +
        'and p.n_version = (Select max(n_version) from pl_Estructura where n_idpl_linea = $2)  ' +
        'and p.n_version is not null', [request.query.n_id_usuario, request.query.n_idpl_linea]);

    let estructuraDetalle = await pool.query('Select distinct p.n_idpl_estructura,a.n_idpl_armado,a.c_codigo c_codigoarmado,a.c_iconomapa, coalesce(ea.n_orientacion,0) n_orientacion,p.n_idpl_linea, ta.c_codigo c_codigotipoarmado, ea.n_cantidad from vw_planos p ' +
        'inner join pl_estructuraarmado ea on p.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0 ' +
        'inner join pl_armado a on ea.n_idpl_armado = a.n_idpl_armado and a.n_borrado = 0 ' +
        'inner join pl_tipoarmado ta on a.n_idpl_tipoarmado = ta.n_idpl_tipoarmado and ta.n_borrado = 0 ' +
        'inner join tra_grupolinea gl on p.n_idpl_linea=gl.n_idpl_linea and gl.n_borrado = 0 ' +
        'inner join tra_grupousuario gu on gl.n_idtra_grupo=gu.n_idtra_grupo and gu.n_borrado = 0 ' +
        'where gu.n_idseg_userprofile = $1 ' +
        'and p.n_idpl_linea = $2 ' +
        'and p.n_version = (Select max(n_version) from pl_Estructura where n_idpl_linea = $2) ' +
        'and (a.c_iconomapa is not null or a.c_iconomapa !=\'-\' or a.c_iconomapa !=\'\') ' +
        'and p.n_version is not null', [request.query.n_id_usuario, request.query.n_idpl_linea]);

    response.status(200).json({ estructuras: queryEstructura.rows, subtramos: querySubtramo.rows, estructuradetalles: estructuraDetalle.rows });

}


module.exports = {
    getusuario,
    getlinea,
    getdato,
    guardardatos,
    guardarfoto,
    guardardatosalmacen,
    guardarfotoalmacen

}