const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;


const get = (request, response) => {
    var obj = valida.validaToken(request)

    let n_idgen_fase = request.body.n_idgen_fase;
    let n_idgen_departamento = request.body.n_idgen_departamento;
    let n_idgen_provincia = request.body.n_idgen_provincia;
    let n_idgen_distrito = request.body.n_idgen_distrito;
    let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
    if (obj.estado) {
        pool.query('with base as ( ' +
            'select   ' +
            'p.n_idgen_proyecto,  ' +
            'coalesce(p.n_id_unidadejecutora, 0) as n_id_unidadejecutora, ' +
            'coalesce(l.c_valorlista, \'\') :: text as c_unidadejecutora,  ' +
            'coalesce(p.n_id_unidadformuladora, 0) as n_id_unidadformuladora,  ' +
            'coalesce(l2.c_valorlista, \'\') :: text as c_unidadformuladora,  ' +
            'coalesce(p.n_id_fuentefinanciamiento, 0) as n_id_fuentefinanciamiento,  ' +
            'coalesce(l3.c_valorlista, \'\') :: text as c_fuentefinanciamiento,  ' +
            'coalesce(p.n_id_tipoejecucion, 0) as n_id_tipoejecucion,  ' +
            'coalesce(l4.c_valorlista, \'\') :: text as c_tipoejecucion,  ' +
            'p.c_codigomem,  ' +
            'p.c_codigocui,  ' +
            'coalesce(p.c_codigosnip, \'-\') :: text as c_codigosnip,  ' +
            'p.c_objetivoproyecto,  ' +
            'p.n_plazoejecucion,  ' +
            'p.n_nrousuarios,  ' +
            'p.n_nroviviendas,  ' +
            'p.c_nombreproyecto,  ' +
            'p.c_fase,  ' +
            'p.c_latitud,  ' +
            'p.c_longitud  ' +
            'from vw_proyecto p  ' +
            'left outer join vw_proyecto_ubigeo u on p.n_idgen_proyecto = u.n_idgen_proyecto  ' +
            'left outer join gen_lista l on p.n_id_unidadejecutora=l.n_idgen_lista and l.n_borrado = 0  ' +
            'left outer join gen_lista l2 on p.n_id_unidadformuladora=l2.n_idgen_lista and l2.n_borrado = 0  ' +
            'left outer join gen_lista l3 on p.n_id_fuentefinanciamiento=l3.n_idgen_lista and l3.n_borrado = 0  ' +
            'left outer join gen_lista l4 on p.n_id_tipoejecucion=l4.n_idgen_lista and l4.n_borrado = 0  ' +
            'where  ' +
            'p.n_borrado = 0 and  ' +
            '(p.n_idgen_fase = $1 or 0 =$1) and  ' +
            '(coalesce(u.n_idgen_departamento, -100) = $2 or 0 =$2) and  ' +
            '(u.n_idgen_provincia = $3 or 0 =$3) and  ' +
            '(u.n_idgen_distrito = $4 or 0 =$4) and  ' +
            '(u.n_idgen_centropoblado = $5 or 0 =$5)   ' +
            ') ' +
            'select distinct ' +
            'n_idgen_proyecto,  ' +
            'n_id_unidadejecutora,  ' +
            'c_unidadejecutora,  ' +
            'n_id_unidadformuladora,  ' +
            'c_unidadformuladora,  ' +
            'n_id_fuentefinanciamiento,  ' +
            'c_fuentefinanciamiento,  ' +
            'n_id_tipoejecucion,  ' +
            'c_tipoejecucion,  ' +
            'c_codigomem,  ' +
            'c_codigocui,  ' +
            'c_codigosnip,  ' +
            'c_fase,  ' +
            'c_objetivoproyecto,  ' +
            'n_plazoejecucion,  ' +
            'n_nrousuarios,  ' +
            'n_nroviviendas,  ' +
            'c_nombreproyecto,  ' +
            'c_latitud,  ' +
            'c_longitud  ' +
            'from base ', [n_idgen_fase,n_idgen_departamento,n_idgen_provincia,n_idgen_distrito,n_idgen_centropoblado]
            , (error, results) => {
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

const get_proyecto_atributo = (request, response) => {
    let fases = [];
    let fases_result = [];
    let atributos = [];
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_fase,c_nombre from gen_fase where n_borrado = 0 order by n_orden asc',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    fases = results.rows;
                    pool.query('select ' +
                        'a.n_idpro_atributo, ' +
                        'a.c_atributo, ' +
                        'a.c_tipodato, ' +
                        'a.b_obligatorio, ' +
                        'coalesce(pa.c_valoratributo,\'\') c_valoratributo, ' +
                        'a.n_idgen_fase, ' +
                        'coalesce(pa.n_idpro_proyectoatributo,0)n_idpro_proyectoatributo ' +
                        'from pro_atributo a ' +
                        'inner join pro_proyectoatributo pa on a.n_idpro_atributo=pa.n_idpro_atributo and pa.n_borrado = 0 and pa.n_idgen_proyecto = $1 ' +
                        'where a.n_borrado = 0 order by a.n_idpro_atributo',
                        [request.body.n_idgen_proyecto],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                            } else {
                                atributos = results.rows;
                                fases.forEach(fase => {
                                    fase.atributos = atributos.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                    fases_result.push(fase);
                                });
                                response.status(200).json({ estado: true, mensaje: "", data: fases_result })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const getfiles = (request, response) => {
    console.log(request.body);
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let fases = [];
        let fases_result = [];
        let atributos = [];
        pool.query('select n_idgen_fase,c_nombre from gen_fase where n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    fases = results.rows;
                    pool.query('Select ' +
                        'p.c_tipodato, ' +
                        'p.c_atributo, ' +
                        'p.n_idgen_fase, ' +
                        'pa.c_valoratributo ' +
                        'from pro_atributo p ' +
                        'inner join pro_proyectoatributo pa on p.n_idpro_atributo = pa.n_idpro_atributo and pa.n_borrado = 0 and pa.n_idgen_proyecto = $1 ' +
                        'where p.n_borrado = 0  ' +
                        'and p.c_tipodato = \'file\'', [request.body.n_idgen_proyecto],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                atributos = results.rows;
                                fases.forEach(fase => {
                                    fase.atributos = atributos.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                    fases_result.push(fase);
                                });
                                response.status(200).json({ estado: true, mensaje: "", data: fases_result })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}



const gettareasincompletas = (request, response) => {
    console.log(request.body);
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let cadena = 'with base as (select ' +
            't.n_idgen_fase, ' +
            't.c_nombre c_fase, ' +
            't.n_idgen_actividad, ' +
            't.c_valoractividad, ' +
            'tp.n_idgen_tarea, ' +
            't.c_descripciontarea, ' +
            'to_char(tp.d_fechaprogramada,\'dd/mm/yyyy\') d_fechaprogramada, ' +
            'to_char(d_fechafin,\'dd/mm/yyyy\') d_fechafin, ' +
            'EXTRACT(DAY FROM age(now(),date(d_fechaprogramada) ) ) n_diaatrasados, ' +
            'EXTRACT(month FROM age(now(),date(d_fechaprogramada) ) )  n_mesatrasados , ' +
            'EXTRACT(year FROM age(now(),date(d_fechaprogramada) ) )  n_anoatrasados  ' +
            'from pro_tareaproyecto tp ' +
            'inner join vw_tarea t on tp.n_idgen_tarea = t.n_idgen_tarea ' +
            'where tp.n_borrado = 0 ' +
            'and tp.n_idgen_proyecto = $1 ' +
            'and d_fechafin is null  ' +
            'and d_fechaprogramada<now()) ' +
            'select * from base order by n_anoatrasados desc,n_mesatrasados desc,n_diaatrasados desc';
        pool.query(cadena, [request.body.n_idgen_proyecto],
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

const getxls = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idgen_departamento = request.body.n_idgen_departamento;
    let n_idgen_provincia = request.body.n_idgen_provincia;
    let n_idgen_distrito = request.body.n_idgen_distrito;
    let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
    let n_idgen_entidad = request.body.n_idgen_entidad;

    if (obj.estado) {
        let cadena = 'with detalle as  \n\r' +
            '(    \n\r' +
            ' SELECT * FROM crosstab(\'select distinct n_idenc_encuesta, n_tipo,\'\'X\'\' c_tipo from vw_detalleencuesta order by 1\', \n\r' +
            '                   \'select m from generate_series(1,11) m\') AS   \n\r' +
            'ct(n_idenc_encuesta int, \n\r ' +
            '"Con redes eléctricas" text,  \n\r' +
            '"Con Panel Solar" text,   \n\r' +
            '"Con Central Fotovoltaica (SFC)" text,   \n\r' +
            '"Con Grupo electrógeno (Térmico)" text,   \n\r' +
            '"Sistema Eólico (Viento)" text,  \n\r' +
            '"Otro tipo de equipos" text,   \n\r' +
            '"No existen redes de MT y BT" text,   ' +
            '"Sin embargo, existen redes de Media Tensión" text,  \n\r ' +
            '"Sin embargo, existen redes de Baja Tensión" text,  \n\r' +
            '"Mi instalación tiene problemas" text,  \n\r ' +
            '"No deseo el servicio" text) )    ' +
            'select    \n\r ' +
            'c_codigo "Código",  ' +
            'c_departamento "Departamento", \n\r ' +
            'c_provincia "Provincia", \n\r' +
            'c_distrito "Distrito", \n\r' +
            'c_centropoblado "Centro Poblado", \n\r' +
            'c_latitud "Latitud",  \n\r' +
            'c_longitud "Longitud",  \n\r' +
            'n_precision "Precisión", \n\r' +
            'n_altitud "Altura", \n\r' +
            ' c_username "Usuario", ' +
            'd_fecha "Fecha de Registro", \n\r' +
            'c_dni "DNI",  c_nombres "Nombres",  \n\r' +
            'c_appaterno "Apellido Paterno", \n\r' +
            'c_apmaterno "Apellido Materno", \n\r' +
            '"Con redes eléctricas" ,  \n\r' +
            ' "Con Panel Solar",  \n\r' +
            ' "Con Central Fotovoltaica (SFC)" ,  ' +
            '"Con Grupo electrógeno (Térmico)" ,  ' +
            '"Sistema Eólico (Viento)" , ' +
            '"Otro tipo de equipos" ,  \n\r' +
            '"No existen redes de MT y BT" ,  \n\r' +
            '"Sin embargo, existen redes de Media Tensión" ,  \n\r' +
            '"Sin embargo, existen redes de Baja Tensión" ,  \n\r' +
            '"Mi instalación tiene problemas" ,  \n\r' +
            '"No deseo el servicio"  \n\r' +
            'from vw_encuesta e    \n\r' +
            'inner join detalle d on e.n_idenc_encuesta = d.n_idenc_encuesta  \n\r' +

            'where (n_idgen_departamento = ' + n_idgen_departamento + ' or 0 = ' + n_idgen_departamento + ') \n\r' +
            'and (n_idgen_provincia = ' + n_idgen_provincia + ' or 0 = ' + n_idgen_provincia + ') \n\r' +
            'and (n_idgen_distrito= ' + n_idgen_distrito + ' or 0 = ' + n_idgen_distrito + ') \n\r' +
            'and (n_idgen_centropoblado = ' + n_idgen_centropoblado + ' or 0 =  ' + n_idgen_centropoblado + ') \n\r' +
            'and (n_idgen_entidad = ' + n_idgen_entidad + ' or 0 = ' + n_idgen_entidad + ') \n\r' +
            'order by e.c_departamento,e.c_provincia,e.c_distrito,e.c_centropoblado,e.d_fecha asc ';
        pool.query(cadena
            , (error, results) => {
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
    get,
    getxls,
    getfiles,
    get_proyecto_atributo,
    gettareasincompletas
}
