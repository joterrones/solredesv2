const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const get = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_fase = request.body.n_idgen_fase;
        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;

        if (n_idgen_departamento > 0) {
            if (n_idgen_fase == 4) {
                pool.query(
                    'WITH	faseproyecto_sup AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        tp.n_idgen_proyecto, \n\r' +
                    '    t.c_nombre, \n\r' +
                    '    t.n_idgen_fase, \n\r' +
                    '    t.n_ordenfase, \n\r' +
                    '    row_number() OVER(PARTITION BY tp.n_idgen_proyecto ORDER BY t.n_ordenfase DESC) AS num \n\r' +
                    '    FROM pro_tareaproyecto tp \n\r' +
                    '    JOIN vw_tarea t ON tp.n_idgen_tarea = t.n_idgen_tarea AND t.n_ordenfase = 4 \n\r' +
                    '    WHERE tp.n_borrado = 0 AND tp.d_fechafin IS NOT NULL \n\r' +
                    '    GROUP BY tp.n_idgen_proyecto, t.c_nombre, t.n_idgen_fase, t.n_ordenfase \n\r' +
                    '), faseproyecto AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        tp.n_idgen_proyecto, \n\r' +
                    '    t.c_nombre, \n\r' +
                    '    t.n_idgen_fase, \n\r' +
                    '    t.n_ordenfase, \n\r' +
                    '    row_number() OVER(PARTITION BY tp.n_idgen_proyecto ORDER BY t.n_ordenfase DESC) AS num \n\r' +
                    '    FROM pro_tareaproyecto tp \n\r' +
                    '    JOIN vw_tarea t ON tp.n_idgen_tarea = t.n_idgen_tarea AND t.n_ordenfase <> 4 \n\r' +
                    '    WHERE tp.n_borrado = 0 AND tp.d_fechafin IS NOT NULL \n\r' +
                    '    GROUP BY tp.n_idgen_proyecto, t.c_nombre, t.n_idgen_fase, t.n_ordenfase \n\r' +
                    '), faseproyecto_2 AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        faseproyecto.n_idgen_proyecto, \n\r' +
                    '    faseproyecto.c_nombre, \n\r' +
                    '    faseproyecto.n_idgen_fase \n\r' +
                    '    FROM faseproyecto \n\r' +
                    '    WHERE faseproyecto.num = 1 \n\r' +
                    ') \n\r' +
                    'select distinct \n\r' +
                    'f2.c_nombre c_fase, \n\r' +
                    '    p.n_idgen_proyecto, \n\r' +
                    '    p.n_borrado, \n\r' +
                    '    p.n_id_usercrea, \n\r' +
                    '    p.n_id_usermodi, \n\r' +
                    '    p.d_fechacrea, \n\r' +
                    '    p.d_fechamodi, \n\r' +
                    '    p.n_idgen_tipoproyecto, \n\r' +
                    '    p.n_id_unidadformuladora, \n\r' +
                    '    p.n_id_unidadejecutora, \n\r' +
                    '    p.n_id_tipoejecucion, \n\r' +
                    '    p.n_id_fuentefinanciamiento, \n\r' +
                    '    p.c_codigomem, \n\r' +
                    '    p.c_codigocui, \n\r' +
                    '    p.c_codigosnip, \n\r' +
                    '    p.c_objetivoproyecto, \n\r' +
                    '    p.n_plazoejecucion, \n\r' +
                    '    p.n_nrousuarios, \n\r' +
                    '    p.n_nroviviendas, \n\r' +
                    '    p.c_nombreproyecto, \n\r' +
                    '    p.c_latitud, \n\r' +
                    '    p.c_longitud, \n\r' +
                    '    p.n_idgen_bolsaproyecto, \n\r' +
                    '    p.n_orden, \n\r' +
                    '    a.nro_usuarios, \n\r' +
                    '    a.nro_beneficiarios, \n\r' +
                    '    e.c_situacionactual, \n\r' +
                    '    e.c_comentario, \n\r' +
                    '    l.c_valorlista as c_unidadejecutora, \n\r' +
                    '    l2.c_valorlista as c_unidadformuladora, \n\r' +
                    '    l3.c_valorlista as c_fuentefinanciamiento, \n\r' +
                    '    l4.c_valorlista as c_tipoejecucion \n\r' +
                    'from gen_proyecto p \n\r' +
                    'inner join faseproyecto_sup f on f.n_idgen_proyecto = p.n_idgen_proyecto \n\r' +
                    'inner join faseproyecto_2 f2 on f2.n_idgen_proyecto = p.n_idgen_proyecto \n\r' +
                    'inner join vw_proyecto_ubigeo u on p.n_idgen_proyecto = u.n_idgen_proyecto \n\r' +
                    'left outer join vw_proyecto_pob_abonados a on p.n_idgen_proyecto = a.n_idgen_proyecto \n\r' +
                    'left outer join vw_estadoactual_proyecto e on p.n_idgen_proyecto = e.n_idgen_proyecto \n\r' +
                    'left outer join gen_lista l on p.n_id_unidadejecutora = l.n_idgen_lista and l.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l2 on p.n_id_unidadformuladora = l2.n_idgen_lista and l2.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l3 on p.n_id_fuentefinanciamiento = l3.n_idgen_lista and l3.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l4 on p.n_id_tipoejecucion = l4.n_idgen_lista and l4.n_borrado = 0 \n\r' +
                    'where(f.n_idgen_fase = $1 or 0 = $1)  and \n\r' +
                    '    (u.n_idgen_departamento = $2 or 0 = $2) and \n\r' +
                    '        (u.n_idgen_provincia = $3 or 0 = $3) and \n\r' +
                    '            (u.n_idgen_distrito = $4 or 0 = $4) and \n\r' +
                    '                (u.n_idgen_centropoblado = $5 or 0 = $5) \n\r' +
                    'order by p.n_orden, p.n_idgen_proyecto'
                    , [n_idgen_fase, n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado],
                    (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                        } else {
                            response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                        }
                    })
            } else {
                pool.query('select distinct \n\r' +
                    'p.c_fase, \n\r' +
                    'p.n_idgen_proyecto, \n\r' +
                    'p.n_borrado, \n\r' +
                    'p.n_id_usercrea, \n\r' +
                    'p.n_id_usermodi, \n\r' +
                    'p.d_fechacrea, \n\r' +
                    'p.d_fechamodi, \n\r' +
                    'p.n_idgen_tipoproyecto, \n\r' +
                    'p.n_id_unidadformuladora, \n\r' +
                    'p.n_id_unidadejecutora, \n\r' +
                    'p.n_id_tipoejecucion, \n\r' +
                    'p.n_id_fuentefinanciamiento, \n\r' +
                    'p.c_codigomem, \n\r' +
                    'p.c_codigocui, \n\r' +
                    'p.c_codigosnip, \n\r' +
                    'p.c_objetivoproyecto, \n\r' +
                    'p.n_plazoejecucion, \n\r' +
                    'p.n_nrousuarios, \n\r' +
                    'p.n_nroviviendas, \n\r' +
                    'p.c_nombreproyecto, \n\r' +
                    'p.c_latitud, \n\r' +
                    'p.c_longitud, \n\r' +
                    'p.n_idgen_bolsaproyecto, \n\r' +
                    'p.n_orden, \n\r' +
                    'a.nro_usuarios, \n\r' +
                    'a.nro_beneficiarios, \n\r' +
                    'e.c_situacionactual, \n\r' +
                    'e.c_comentario, \n\r' +
                    'l.c_valorlista as c_unidadejecutora, \n\r' +
                    'l2.c_valorlista as c_unidadformuladora, \n\r' +
                    'l3.c_valorlista as c_fuentefinanciamiento, \n\r' +
                    'l4.c_valorlista as c_tipoejecucion \n\r' +
                    ' from vw_proyecto p \n\r' +
                    'inner join vw_proyecto_ubigeo u on p.n_idgen_proyecto = u.n_idgen_proyecto  \n\r' +
                    'left outer join vw_proyecto_pob_abonados a on p.n_idgen_proyecto = a.n_idgen_proyecto \n\r' +
                    'left outer join vw_estadoactual_proyecto e on p.n_idgen_proyecto = e.n_idgen_proyecto \n\r' +

                    'left outer join gen_lista l on p.n_id_unidadejecutora = l.n_idgen_lista and l.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l2 on p.n_id_unidadformuladora = l2.n_idgen_lista and l2.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l3 on p.n_id_fuentefinanciamiento = l3.n_idgen_lista and l3.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l4 on p.n_id_tipoejecucion = l4.n_idgen_lista and l4.n_borrado = 0 \n\r' +

                    'where (p.n_idgen_fase = $1 or 0 = $1)  and \n\r' +
                    '(u.n_idgen_departamento = $2 or 0 =$2) and \n\r' +
                    '(u.n_idgen_provincia = $3 or 0 =$3) and \n\r' +
                    '(u.n_idgen_distrito = $4 or 0 =$4) and \n\r' +
                    '(u.n_idgen_centropoblado = $5 or 0 =$5) order by p.n_orden,p.n_idgen_proyecto'
                    , [n_idgen_fase, n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado],
                    (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                        } else {
                            response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                        }
                    })
            }

        } else {

            if (n_idgen_fase == 4) {
                pool.query(
                    'WITH	faseproyecto_sup AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        tp.n_idgen_proyecto, \n\r' +
                    '    t.c_nombre, \n\r' +
                    '    t.n_idgen_fase, \n\r' +
                    '    t.n_ordenfase, \n\r' +
                    '    row_number() OVER(PARTITION BY tp.n_idgen_proyecto ORDER BY t.n_ordenfase DESC) AS num \n\r' +
                    '    FROM pro_tareaproyecto tp \n\r' +
                    '    JOIN vw_tarea t ON tp.n_idgen_tarea = t.n_idgen_tarea AND t.n_ordenfase = 4 \n\r' +
                    '    WHERE tp.n_borrado = 0 AND tp.d_fechafin IS NOT NULL \n\r' +
                    '    GROUP BY tp.n_idgen_proyecto, t.c_nombre, t.n_idgen_fase, t.n_ordenfase \n\r' +
                    '), faseproyecto AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        tp.n_idgen_proyecto, \n\r' +
                    '    t.c_nombre, \n\r' +
                    '    t.n_idgen_fase, \n\r' +
                    '    t.n_ordenfase, \n\r' +
                    '    row_number() OVER(PARTITION BY tp.n_idgen_proyecto ORDER BY t.n_ordenfase DESC) AS num \n\r' +
                    '    FROM pro_tareaproyecto tp \n\r' +
                    '    JOIN vw_tarea t ON tp.n_idgen_tarea = t.n_idgen_tarea AND t.n_ordenfase <> 4 \n\r' +
                    '    WHERE tp.n_borrado = 0 AND tp.d_fechafin IS NOT NULL \n\r' +
                    '    GROUP BY tp.n_idgen_proyecto, t.c_nombre, t.n_idgen_fase, t.n_ordenfase \n\r' +
                    '), faseproyecto_2 AS( \n\r' +
                    '    SELECT  \n\r' +
                    '        faseproyecto.n_idgen_proyecto, \n\r' +
                    '    faseproyecto.c_nombre, \n\r' +
                    '    faseproyecto.n_idgen_fase \n\r' +
                    '    FROM faseproyecto \n\r' +
                    '    WHERE faseproyecto.num = 1 \n\r' +
                    ') \n\r' +
                    'select distinct \n\r' +
                    'f2.c_nombre c_fase, \n\r' +
                    '    p.n_idgen_proyecto, \n\r' +
                    '    p.n_borrado, \n\r' +
                    '    p.n_id_usercrea, \n\r' +
                    '    p.n_id_usermodi, \n\r' +
                    '    p.d_fechacrea, \n\r' +
                    '    p.d_fechamodi, \n\r' +
                    '    p.n_idgen_tipoproyecto, \n\r' +
                    '    p.n_id_unidadformuladora, \n\r' +
                    '    p.n_id_unidadejecutora, \n\r' +
                    '    p.n_id_tipoejecucion, \n\r' +
                    '    p.n_id_fuentefinanciamiento, \n\r' +
                    '    p.c_codigomem, \n\r' +
                    '    p.c_codigocui, \n\r' +
                    '    p.c_codigosnip, \n\r' +
                    '    p.c_objetivoproyecto, \n\r' +
                    '    p.n_plazoejecucion, \n\r' +
                    '    p.n_nrousuarios, \n\r' +
                    '    p.n_nroviviendas, \n\r' +
                    '    p.c_nombreproyecto, \n\r' +
                    '    p.c_latitud, \n\r' +
                    '    p.c_longitud, \n\r' +
                    '    p.n_idgen_bolsaproyecto, \n\r' +
                    '    p.n_orden, \n\r' +
                    '    a.nro_usuarios, \n\r' +
                    '    a.nro_beneficiarios, \n\r' +
                    '    e.c_situacionactual, \n\r' +
                    '    e.c_comentario, \n\r' +
                    '    l.c_valorlista as c_unidadejecutora, \n\r' +
                    '    l2.c_valorlista as c_unidadformuladora, \n\r' +
                    '    l3.c_valorlista as c_fuentefinanciamiento, \n\r' +
                    '    l4.c_valorlista as c_tipoejecucion \n\r' +
                    'from gen_proyecto p \n\r' +
                    'inner join faseproyecto_sup f on f.n_idgen_proyecto = p.n_idgen_proyecto \n\r' +
                    'inner join faseproyecto_2 f2 on f2.n_idgen_proyecto = p.n_idgen_proyecto \n\r' +
                    'inner join vw_proyecto_ubigeo u on p.n_idgen_proyecto = u.n_idgen_proyecto \n\r' +
                    'left outer join vw_proyecto_pob_abonados a on p.n_idgen_proyecto = a.n_idgen_proyecto \n\r' +
                    'left outer join vw_estadoactual_proyecto e on p.n_idgen_proyecto = e.n_idgen_proyecto \n\r' +
                    'left outer join gen_lista l on p.n_id_unidadejecutora = l.n_idgen_lista and l.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l2 on p.n_id_unidadformuladora = l2.n_idgen_lista and l2.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l3 on p.n_id_fuentefinanciamiento = l3.n_idgen_lista and l3.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l4 on p.n_id_tipoejecucion = l4.n_idgen_lista and l4.n_borrado = 0 \n\r' +
                    'where(f.n_idgen_fase = $1 or 0 = $1)  and \n\r' +
                    '    (coalesce(u.n_idgen_departamento, -100) = $2 or 0 = $2) \n\r' +
                    'order by p.n_orden, p.n_idgen_proyecto'
                    , [n_idgen_fase, n_idgen_departamento],
                    (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                        } else {
                            response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                        }
                    })
            } else {
                pool.query('select distinct \n\r' +
                    'p.c_fase, \n\r' +
                    'p.n_idgen_proyecto, \n\r' +
                    'p.n_borrado, \n\r' +
                    'p.n_id_usercrea, \n\r' +
                    'p.n_id_usermodi, \n\r' +
                    'p.d_fechacrea, \n\r' +
                    'p.d_fechamodi, \n\r' +
                    'p.n_idgen_tipoproyecto, \n\r' +
                    'p.n_id_unidadformuladora, \n\r' +
                    'p.n_id_unidadejecutora, \n\r' +
                    'p.n_id_tipoejecucion, \n\r' +
                    'p.n_id_fuentefinanciamiento, \n\r' +
                    'p.c_codigomem, \n\r' +
                    'p.c_codigocui, \n\r' +
                    'p.c_codigosnip, \n\r' +
                    'p.c_objetivoproyecto, \n\r' +
                    'p.n_plazoejecucion, \n\r' +
                    'p.n_nrousuarios, \n\r' +
                    'p.n_nroviviendas, \n\r' +
                    'p.c_nombreproyecto, \n\r' +
                    'p.c_latitud, \n\r' +
                    'p.c_longitud, \n\r' +
                    'p.n_idgen_bolsaproyecto, \n\r' +
                    'p.n_orden, \n\r' +
                    'a.nro_usuarios, \n\r' +
                    'a.nro_beneficiarios, \n\r' +
                    'e.c_situacionactual, \n\r' +
                    'e.c_comentario, \n\r' +
                    'l.c_valorlista as c_unidadejecutora, \n\r' +
                    'l2.c_valorlista as c_unidadformuladora, \n\r' +
                    'l3.c_valorlista as c_fuentefinanciamiento, \n\r' +
                    'l4.c_valorlista as c_tipoejecucion \n\r' +
                    ' from vw_proyecto p \n\r' +
                    'left outer join vw_proyecto_ubigeo u on p.n_idgen_proyecto = u.n_idgen_proyecto \n\r' +
                    'left outer join vw_proyecto_pob_abonados a on p.n_idgen_proyecto = a.n_idgen_proyecto \n\r' +
                    'left outer join vw_estadoactual_proyecto e on p.n_idgen_proyecto = e.n_idgen_proyecto \n\r' +

                    'left outer join gen_lista l on p.n_id_unidadejecutora = l.n_idgen_lista and l.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l2 on p.n_id_unidadformuladora = l2.n_idgen_lista and l2.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l3 on p.n_id_fuentefinanciamiento = l3.n_idgen_lista and l3.n_borrado = 0 \n\r' +
                    'left outer join gen_lista l4 on p.n_id_tipoejecucion = l4.n_idgen_lista and l4.n_borrado = 0 \n\r' +

                    ' where (p.n_idgen_fase = $1 or 0 = $1) \n\r' +
                    ' and (coalesce(u.n_idgen_departamento, -100) = $2 or 0 =$2) \n\r' +
                    ' order by p.n_orden,p.n_idgen_proyecto'
                    , [n_idgen_fase, n_idgen_departamento],
                    (error, results) => {
                        if (error) {
                            response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                        } else {
                            response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                        }
                    })
            }




        }
    } else {
        response.status(200).json(obj)
    }
}


const get_exportalldata = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_fase = request.body.n_idgen_fase;
        pool.query('    select  ' +
            'p.c_codigomem, ' +
            't.c_nombre as c_fase, ' +
            't.c_valoractividad c_actividad, ' +
            't.c_descripciontarea c_tarea, ' +
            'da.c_datoadicional, ' +
            'da.c_valordatoadicional, ' +
            'da.n_idgen_fase ' +
            'from vw_datoadicional_tareaproyecto da ' +
            'inner join vw_tarea t on da.n_idgen_tarea = t.n_idgen_tarea  ' +
            'inner join vw_proyecto p on da.n_idgen_proyecto = p.n_idgen_proyecto ' +
            'where (p.n_idgen_fase = $1 or 0 = $1) ' +
            'order by p.n_orden,t.n_orden', [n_idgen_fase],
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




const get_cartafianza = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_fase = request.body.n_idgen_fase;
        pool.query('select n_idpro_cartagarantia,n_idgen_proyecto,n_idgen_fase,n_idgen_tipocarta,c_nro_documento,c_entidad,d_fechaemision,d_fechavence,n_monto,c_estado,c_observaciones,c_ruta, ' +
            'd_fechavence :: date - now() :: date n_days,CASE WHEN c_estado = \'VIGENTE\' THEN (CASE WHEN (d_fechavence :: date - now() :: date) <= 15 AND (d_fechavence :: date - now() :: date) >= 0 THEN 1 ELSE 0 END) ELSE 0 END n_alerta ' +
            'from pro_cartagarantia ' +
            'where n_borrado = 0 and n_idgen_proyecto = $1 and (n_idgen_fase = $2 or 0 = $2)', [n_idgen_proyecto, n_idgen_fase],
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

const save_cartafianza = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        let n_idpro_cartagarantia = request.body.n_idpro_cartagarantia;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_fase = request.body.n_idgen_fase;
        let n_idgen_tipocarta = request.body.n_idgen_tipocarta;
        let c_nro_documento = request.body.c_nro_documento;
        let c_entidad = request.body.c_entidad;
        let d_fechaemision = request.body.d_fechaemision;
        let d_fechavence = request.body.d_fechavence;
        let n_monto = request.body.n_monto;
        let c_estado = request.body.c_estado;
        let c_observaciones = request.body.c_observaciones;
        let c_ruta = request.body.c_ruta;
        if (n_idpro_cartagarantia == 0) {
            pool.query('insert into pro_cartagarantia( ' +
                'n_idpro_cartagarantia,n_idgen_proyecto,n_idgen_fase,n_idgen_tipocarta,c_nro_documento,c_entidad,d_fechaemision,d_fechavence,n_monto,c_estado,c_observaciones ,c_ruta,n_borrado,d_fechacrea,n_id_usercrea) ' +
                'values (default,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,now(),1)', [n_idgen_proyecto, n_idgen_fase, n_idgen_tipocarta, c_nro_documento, c_entidad, d_fechaemision, d_fechavence, n_monto, c_estado, c_observaciones, c_ruta],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        } else {
            pool.query('update pro_cartagarantia set ' +
                'n_idgen_proyecto=$1,n_idgen_fase=$2,n_idgen_tipocarta=$3,c_nro_documento=$4,c_entidad=$5,d_fechaemision=$6,d_fechavence=$7,n_monto=$8,c_estado=$9,c_observaciones=$10,c_ruta =$11 ' +
                'where n_idpro_cartagarantia=$12', [n_idgen_proyecto, n_idgen_fase, n_idgen_tipocarta, c_nro_documento, c_entidad, d_fechaemision, d_fechavence, n_monto, c_estado, c_observaciones, c_ruta, n_idpro_cartagarantia],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        }
    } else {
        response.status(200).json(obj)
    }
}

const delete_cartafianza = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_cartagarantia = request.body.n_idpro_cartagarantia;
        pool.query('update pro_cartagarantia set n_borrado = n_idpro_cartagarantia, d_fechamodi = now() where n_idpro_cartagarantia =$1', [n_idpro_cartagarantia],
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


const get_tipocarta = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_tipocarta,c_valor from gen_tipocarta where n_borrado = 0',
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

const get_situacion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        pool.query('select n_idpro_situacion ,n_idgen_proyecto,c_situacionactual, c_comentario, u.c_username c_usuario, ' +
            ' case when s.d_fechamodi is  null then to_char(s.d_fechacrea,\'dd/MM/yyyy hh:mm:ss\') else to_char(s.d_fechamodi,\'dd/MM/yyyy hh:mm:ss\') end d_fecha from pro_situacion s ' +
            'inner join seg_user u on case when s.n_id_usermodi is null then s.n_id_usercrea else s.n_id_usermodi end = u.n_idseg_user   and u.n_borrado = 0' +
            'where n_idgen_proyecto = $1 and s.n_borrado = 0 order by n_idpro_situacion desc', [n_idgen_proyecto],
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


const save_orden = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_orden = request.body.n_orden;

        pool.query('update gen_proyecto set n_orden =$2, d_fechacrea=now() where n_idgen_proyecto=$1 ', [n_idgen_proyecto, n_orden],
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


const save_situacion = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        let n_idpro_situacion = request.body.n_idpro_situacion;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let c_situacionactual = request.body.c_situacionactual;
        let c_comentario = request.body.c_comentario;
        let n_id_usercrea = request.body.n_id_usercrea;
        if (n_idpro_situacion > 0) {
            pool.query('update pro_situacion set n_idgen_proyecto =$1 ,c_situacionactual = $2,c_comentario =$3,d_fechamodi=now(),n_id_usermodi=$4 where n_idpro_situacion =$5 ',
                [n_idgen_proyecto, c_situacionactual, c_comentario, n_id_usercrea, n_idpro_situacion],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        } else {
            pool.query('insert into pro_situacion(n_idpro_situacion,n_idgen_proyecto,c_situacionactual,c_comentario,n_borrado,d_fechacrea,n_id_usercrea) ' +
                'values (default,$1,$2,$3,0,now(),$4)', [n_idgen_proyecto, c_situacionactual, c_comentario, n_id_usercrea],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        }

    } else {
        response.status(200).json(obj)
    }
}

const get_lista = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_lista,n_idgen_grupolista ,c_valorlista,c_descripcion  from gen_lista  where n_borrado = 0',
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
const getid = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select t.c_nombre tarea, pt.d_fechahorainicioP,pt.d_fechahorafinP, pt.d_fechahorainicioR,pt.d_fechahorafinR from gen_proyectotarea pt ' +
            'inner join gen_tarea t on pt.n_idgen_tarea = t.n_idgen_tarea and t.n_borrado = 0 ' +
            'where pt.n_borrado = 0 and pt.n_idgen_proyecto=$1',
            [request.body.n_idgen_proyecto],
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

const getid_dos = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('with base as ( ' +
            'select f.c_nombre fase, e.c_nombre etapa, t.c_nombre tarea, pt.d_fechahorainicioP,pt.d_fechahorafinP, pt.d_fechahorainicioR,pt.d_fechahorafinR from gen_proyectotarea pt ' +
            'inner join gen_tarea t on pt.n_idgen_tarea = t.n_idgen_tarea and t.n_borrado = 0 ' +
            'inner join gen_etapa e on t.n_idgen_etapa = e.n_idgen_etapa and e.n_Borrado = 0 ' +
            'inner join gen_fase f on e.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 ' +
            'where pt.n_borrado = 0  and pt.n_idgen_proyecto=$1 ' +
            ') ' +
            'select fase, min(d_fechahorainicioP) inicio, max(d_fechahorafinP) fin, max(d_fechahorafinP)-min(d_fechahorainicioP)  plazo from base ' +
            'group by fase',
            [request.body.n_idgen_proyecto],
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
const getusuarioproyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select  n_idseg_user, c_username, coalesce(pu.n_idgen_proyectousuario,0)n_idgen_proyectousuario,case when pu.n_idgen_proyectousuario is null then false else true end b_flag,coalesce(pu.n_idgen_proyecto,0)n_idgen_proyecto from seg_user u ' +
            'left outer join gen_proyectousuario pu on u.n_idseg_user = pu.n_idseg_usuario and pu.n_borrado = 0 and pu.n_idgen_proyecto = $1',
            [request.body.n_idgen_proyecto],
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

const guardarusuarioproyecto = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idgen_proyecto = request.body.n_idgen_proyecto;
    let n_idseg_user = request.body.n_idseg_user;
    let n_idgen_proyectousuario = request.body.n_idgen_proyectousuario;
    x
    let cadena = '';
    if (obj.estado) {
        if (n_idgen_proyectousuario) {
            cadena = 'update  gen_proyectousuario set n_Borrado = n_idgen_proyectousuario where n_idgen_proyectousuario = ' + n_idgen_proyectousuario;
        } else {
            cadena = 'insert into gen_proyectousuario(n_idgen_proyectousuario, n_idseg_usuario, n_idgen_proyecto,n_borrado,d_fechacrea,n_id_usercrea) values ' +
                '(default,' + n_idseg_user + ',' + n_idgen_proyecto + ',0,now(),1 )';
        }

        pool.query(cadena,
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
        let atributos = request.body.atributos;

        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_tipoproyecto = request.body.n_idgen_tipoproyecto;
        let c_nombreproyecto = request.body.c_nombreproyecto.toUpperCase();
        let n_id_unidadformuladora = request.body.n_id_unidadformuladora;
        let n_id_unidadejecutora = request.body.n_id_unidadejecutora;
        let n_id_tipoejecucion = request.body.n_id_tipoejecucion;
        let n_id_fuentefinanciamiento = request.body.n_id_fuentefinanciamiento;
        let c_codigomem = request.body.c_codigomem.toUpperCase();
        let c_codigocui = request.body.c_codigocui.toUpperCase();
        let c_codigosnip = request.body.c_codigosnip.toUpperCase();
        let c_objetivoproyecto = request.body.c_objetivoproyecto.toUpperCase();
        let n_plazoejecucion = request.body.n_plazoejecucion;
        let n_nrousuarios = request.body.n_nrousuarios;
        let n_nroviviendas = request.body.n_nroviviendas;
        let c_latitud = request.body.c_latitud;
        let c_longitud = request.body.c_longitud;


        if (n_idgen_tipoproyecto == undefined) {
            n_idgen_tipoproyecto = null;
        }
        let cadena = '';

        if (n_idgen_proyecto == 0) {
            cadena = 'insert into gen_proyecto(n_idgen_proyecto,c_nombreproyecto,n_id_unidadformuladora,n_id_unidadejecutora,n_id_tipoejecucion,n_id_fuentefinanciamiento, ' +
                'c_codigomem,c_codigocui,c_codigosnip,c_objetivoproyecto, n_plazoejecucion,n_nrousuarios,n_nroviviendas,c_latitud,c_longitud,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default ,\'' + c_nombreproyecto + '\', ' + n_id_unidadformuladora + ',' + n_id_unidadejecutora + ',' + n_id_tipoejecucion + ',' + n_id_fuentefinanciamiento + ',\'' + c_codigomem + '\',\'' + c_codigocui + '\',\'' + c_codigosnip + '\',\'' +
                c_objetivoproyecto + '\',' + n_plazoejecucion + ',' + n_nrousuarios + ',' + n_nroviviendas + ',\'' + c_latitud + '\',\'' + c_longitud + '\',0,now(),1) returning *;';
        } else {
            cadena = 'update gen_proyecto set ' +
                'c_nombreproyecto= \'' + c_nombreproyecto +
                '\',n_id_unidadformuladora= ' + n_id_unidadformuladora +
                ',n_id_unidadejecutora= ' + n_id_unidadejecutora +
                ',n_id_tipoejecucion= ' + n_id_tipoejecucion +
                ',n_id_fuentefinanciamiento= ' + n_id_fuentefinanciamiento +
                ',c_codigomem= \'' + c_codigomem +
                '\',c_codigocui= \'' + c_codigocui +
                '\',c_codigosnip= \'' + c_codigosnip +
                '\',c_objetivoproyecto= \'' + c_objetivoproyecto +
                '\',n_plazoejecucion= ' + n_plazoejecucion +
                ',n_nrousuarios= ' + n_nrousuarios +
                ',n_nroviviendas= ' + n_nroviviendas +
                ',c_latitud= \'' + c_latitud + '\'' +
                ',c_longitud= \'' + c_longitud + '\'' +
                ' where n_idgen_proyecto=' + n_idgen_proyecto + ' returning *;';
        }

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {

                    n_idgen_proyecto = results.rows[0].n_idgen_proyecto;
                    if (atributos.length > 0) {
                        atributos.forEach(atributo => {

                            if (atributo.n_idpro_proyectoatributo == 0) {
                                if (atributo.c_valoratributo != '') {
                                    pool.query('insert into pro_proyectoatributo(n_idpro_proyectoatributo,n_idgen_proyecto,n_idpro_atributo,c_valoratributo,n_borrado, n_id_usercrea,d_fechacrea)  ' +
                                        'values(default,$1,$2,$3,0,1,now())', [n_idgen_proyecto, atributo.n_idpro_atributo, atributo.c_valoratributo.toUpperCase()],
                                        (error, results) => {
                                            if (error) {
                                            } else {
                                            }
                                        })
                                }
                            } else {
                                pool.query('update pro_proyectoatributo set c_valoratributo=$2 where  n_idpro_proyectoatributo=$1', [atributo.n_idpro_proyectoatributo, atributo.c_valoratributo.toUpperCase()],
                                    (error, results) => {
                                        if (error) {
                                        } else {
                                        }
                                    })
                            }
                        });
                    }
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_tarea_proyecto = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select t.c_nombre,t.c_valoractividad,t.n_idgen_tarea,t.c_descripciontarea,tp.d_fechafin,tp.d_fechaprogramada,coalesce(tp.n_duracion,0) n_duracion,coalesce(tp.n_posicion,0) n_posicion,coalesce(tp.b_diasferiados,false)b_diasferiados,tp.n_idpro_tareaproyecto  from vw_tarea t ' +
            'inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0 and tp.n_idgen_proyecto = $1 order by t.n_ordenfase asc, t.n_orden asc, tp.n_posicion asc',
            [request.body.n_idgen_proyecto],
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


const get_proyecto_atributo = (request, response) => {
    let fases = [];
    let atributos = [];
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select ' +
            'a.n_idpro_atributo, ' +
            'a.c_atributo, ' +
            'a.c_tipodato, ' +
            'a.b_obligatorio, ' +
            'a.c_unidad, ' +
            'coalesce(pa.c_valoratributo,\'\') c_valoratributo, ' +
            'coalesce(pa.n_idpro_proyectoatributo,0)n_idpro_proyectoatributo, ' +
            'a.n_idgen_fase ' +
            'from pro_atributo a ' +
            'Left outer join pro_proyectoatributo pa on a.n_idpro_atributo=pa.n_idpro_atributo and pa.n_borrado = 0 and pa.n_idgen_proyecto = $1 ' +
            'where a.n_borrado = 0 order by a.n_idpro_atributo',
            [request.body.n_idgen_proyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    atributos = results.rows;
                    pool.query('select n_idgen_fase, c_nombre from gen_fase where n_borrado = 0  order by n_orden',
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                            } else {
                                fases = results.rows;
                                let fasesresult = [];
                                fases.forEach(fase => {
                                    let atributosresult = atributos.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                    fase.atributos = atributosresult;
                                    fasesresult.push(fase);
                                });
                                response.status(200).json({ estado: true, mensaje: "", data: fasesresult })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_proyecto_atributo_file = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select ' +
            'a.n_idpro_atributo, ' +
            'a.c_atributo, ' +
            'a.c_tipodato, ' +
            'a.b_obligatorio, ' +
            'a.c_unidad, ' +
            'coalesce(pa.c_valoratributo,\'\') c_valoratributo, ' +
            'coalesce(pa.n_idpro_proyectoatributo,0)n_idpro_proyectoatributo ' +
            'from pro_atributo a ' +
            'Left outer join pro_proyectoatributo pa on a.n_idpro_atributo=pa.n_idpro_atributo and pa.n_borrado = 0 and pa.n_idgen_proyecto = $1 ' +
            'where a.n_borrado = 0 and a.c_tipodato=\'file\' order by a.n_idpro_atributo',
            [request.body.n_idgen_proyecto],
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

const get_tarea_proyecto_registro = (request, response) => {
    var obj = valida.validaToken(request)
    let fases = [];
    let resultados = [];
    let actividades = [];
    let actividades_resultados = [];
    let tareas = [];
    if (obj.estado) {
        pool.query('select distinct t.n_idgen_fase, t.c_nombre,t.n_ordenfase    from vw_tarea t  ' +
            'inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0 and tp.n_idgen_proyecto = $1 order by t.n_ordenfase ',
            [request.body.n_idgen_proyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    fases = results.rows;
                    pool.query('select distinct t.n_idgen_actividad, t.c_valoractividad,t.n_idgen_fase,t.n_idgen_actividad  from vw_tarea t ' +
                        'inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0 and tp.n_idgen_proyecto = $1 order by t.n_idgen_actividad',
                        [request.body.n_idgen_proyecto],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                actividades = results.rows;
                                pool.query('select * from vw_get_tarea_proyecto_registro where n_idgen_proyecto = $1 order by n_idgen_tarea',
                                    [request.body.n_idgen_proyecto],
                                    (error, results) => {
                                        if (error) {
                                            response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                                        } else {
                                            tareas = results.rows;
                                            fases.forEach(fase => {
                                                actividades_resultados = [];
                                                actividades.forEach(actividad => {
                                                    actividad.tareas = tareas.filter(o => o.n_idgen_actividad == actividad.n_idgen_actividad);
                                                    actividades_resultados.push(actividad);
                                                });
                                                fase.actividades = actividades_resultados.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                                resultados.push(fase);
                                            });

                                            response.status(200).json({ estado: true, mensaje: "", data: resultados })
                                        }
                                    })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_tarea_edit_proyecto_registro = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_tarea = request.body.n_idgen_tarea;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        pool.query('select distinct t.n_idgen_tarea, t.c_descripciontarea,t.n_idgen_actividad,tp.d_fechaprogramada,tp.d_fechafin, TO_CHAR(tp.d_fechafin,\'dd/mm/yyyy\') d_fechafinformat,tp.n_idpro_tareaproyecto, t.n_tipo, n_id_tareapadre,tp.n_posicion,t.b_hitocontrol,t.n_orden  from vw_tarea t ' +
            'inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0  and t.n_idgen_tarea = $1 and tp.n_idgen_proyecto = $2  order by t.n_orden',
            [n_idgen_tarea, n_idgen_proyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    results.rows;
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })

    } else {
        response.status(200).json(obj)
    }
}

const get_datoadicional_registro = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_tareaproyecto = request.body.n_idpro_tareaproyecto;
        pool.query('select aa.n_idgen_datoadicional, aa.c_dato, aa.c_tipodato, aa.n_idgen_tarea, av.c_valor,aa.c_unidad from gen_datoadicional aa ' +
            'inner join pro_tareaproyecto ta on aa.n_idgen_tarea = ta.n_idgen_tarea and ta.n_borrado = 0 and ta.n_idpro_tareaproyecto = $1 ' +
            'left outer join pro_adicionalvalor av on aa.n_idgen_datoadicional = av.n_idgen_datoadicional and ta.n_idpro_tareaproyecto = av.n_idpro_tareaproyecto and  av.n_borrado = 0 ' +
            'where aa.n_borrado = 0 order by aa.n_idgen_datoadicional',
            [n_idpro_tareaproyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    results.rows;
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })

    } else {
        response.status(200).json(obj)
    }
}


const save_tarea_proyecto = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let cadena = 'insert into pro_tareaproyecto(n_idgen_proyecto,n_idgen_tarea,n_duracion,b_diasferiados,n_borrado,d_fechacrea,n_id_usercrea) ' +
            'select ' + request.body.n_idgen_proyecto + ',t.n_idgen_tarea,t.n_duracion,t.b_diasferiados,0,now(),1  from vw_tarea t ' +
            'inner join gen_tipoproyectotarea tpt on t.n_idgen_tarea = tpt.n_idgen_tarea and tpt.n_borrado = 0 and tpt.n_idgen_tipoproyecto = ' + request.body.n_idgen_tipoproyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const save_tarea_proyecto_individual = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        console.log(request.body)
        let n_idpro_tareaproyecto = request.body.n_idpro_tareaproyecto;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let n_idgen_tarea = request.body.n_idgen_tarea;
        let b_diasferiados = request.body.b_diasferiados;
        let n_posicion = request.body.n_posicion;
        let n_duracion = request.body.n_duracion;

        if (n_idpro_tareaproyecto == 0) {
            pool.query('insert into pro_tareaproyecto(n_idpro_tareaproyecto,n_idgen_proyecto,n_idgen_tarea,n_cantidadelementos,n_posicion,b_diasferiados,n_duracion, n_borrado, n_id_usercrea, d_fechacrea) ' +
                'values(default,$1,$2,1,$3,$4,$5,0,1,now());', [n_idgen_proyecto, n_idgen_tarea, n_posicion, b_diasferiados, n_duracion],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })

                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        } else {
            pool.query('update pro_tareaproyecto set n_idgen_proyecto=$1,n_idgen_tarea=$2,n_posicion=$3,b_diasferiados=$4,n_duracion=$6 ' +
                'where n_idpro_tareaproyecto=$5;', [n_idgen_proyecto, n_idgen_tarea, n_posicion, b_diasferiados, n_idpro_tareaproyecto, n_duracion],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })

                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        }


    } else {
        response.status(200).json(obj)
    }
}

const delete_tarea_proyecto_individual = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_tareaproyecto = request.body.n_idpro_tareaproyecto;
        pool.query('update pro_tareaproyecto set n_borrado = n_idpro_tareaproyecto where n_idpro_tareaproyecto = $1', [n_idpro_tareaproyecto],
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

const save_valor_datoadicional = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let valoresadicionales = request.body.valoresadicionales;
        let n_idpro_tareaproyecto = request.body.n_idpro_tareaproyecto;
        let d_fechafin = request.body.d_fechafin;
        let d_fechaprogramada = request.body.d_fechaprogramada;
        let b_aplica = request.body.b_aplica;
        pool.query('update pro_tareaproyecto set d_fechafin =$2, b_aplica=$3, d_fechaprogramada = $4, d_fechamodi=now() where n_idpro_tareaproyecto =$1', [n_idpro_tareaproyecto, d_fechafin, b_aplica, d_fechaprogramada],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    if (valoresadicionales.length > 0) {
                        valoresadicionales.forEach(element => {
                            let n_idpro_adicionalvalor = element.n_idpro_adicionalvalor;
                            let c_valor = element.c_valor;
                            let n_idgen_datoadicional = element.n_idgen_datoadicional;
                            let n_idpro_tareamultiple = element.n_idpro_tareamultiple;
                            if (n_idpro_tareamultiple == undefined) {
                                n_idpro_tareamultiple = null;
                            }
                            if (n_idpro_adicionalvalor == null) {
                                n_idpro_adicionalvalor = 0;
                            }
                            let cadena = 'select * from fn_valoradicional_insertupdate(' + n_idgen_datoadicional + ',' + n_idpro_tareaproyecto + ',\'' + c_valor + '\');';
                            pool.query(cadena,
                                (error, results) => {
                                    if (error) {
                                        console.log(error.stack);
                                        console.log(cadena);
                                        response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                                    }
                                })
                        });
                    }
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })

    } else {
        response.status(200).json(obj)
    }
}

const delete_proyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let cadena = '';
        if (n_idgen_proyecto > 0) {
            cadena = 'update gen_proyecto set n_borrado= n_idgen_proyecto where n_idgen_proyecto=' + n_idgen_proyecto + ';';
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

const delete_situacion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        console.log(request.body);
        let n_idpro_situacion = request.body.n_idpro_situacion;
        let cadena = '';
        if (n_idpro_situacion > 0) {
            cadena = 'update pro_situacion set n_borrado= n_idpro_situacion where n_idpro_situacion=' + n_idpro_situacion + ';';
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



const fechar_tarea = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let d_fecha = request.body.d_fecha;
        pool.query('select ' +
            'fn_ordenartarea(n_idgen_tarea) ' +
            'from gen_tarea ' +
            'where n_borrado = 0',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                } else {
                    pool.query('select ' +
                        'fn_fechartarea(' + n_idgen_proyecto + ',\'' + d_fecha + '\') ',
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                            } else {
                                response.status(200).json({ estado: true, mensaje: "", data: null })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_dato_fase = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let fases = [];
        let detallefases = [];
        pool.query('Select n_idgen_fase,c_nombre from gen_fase where n_borrado = 0 and n_idgen_fase not in (4)',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    fases = results.rows;

                    let cadena =
                        '   with inversion_base as (  \n\r' +
                        '       select p.n_idgen_proyecto, pa.c_valoratributo n_montoinversiontotal, a.n_idgen_fase  \n\r' +
                        '       from gen_proyecto p  \n\r' +
                        '       inner join pro_proyectoatributo pa on p.n_idgen_proyecto = pa.n_idgen_proyecto and pa.n_borrado = 0  \n\r' +
                        '       inner join pro_atributo a on pa.n_idpro_atributo = a.n_idpro_atributo and a.n_borrado = 0  \n\r' +
                        '       and a.c_atributo in(\'Inversión Incluye IGV\',\'Valor Referencial incl. IGV\',\'Costo Obra incl. IGV\')  \n\r' +
                        '   ),	inversion_total as (  \n\r' +
                        '       select n_idgen_proyecto, n_montoinversiontotal,case n_idgen_fase when 4 then 3 else n_idgen_fase end n_idgen_fase  \n\r' +
                        '       from inversion_base \n\r' +
                        '       where n_idgen_fase = (select max(n_idgen_fase) from inversion_base p) and n_montoinversiontotal is not null and n_montoinversiontotal!=\'\'  \n\r' +
                        '   ),	tareas_adicionales1 as (  \n\r' +
                        '       select \n\r' +
                        '           tp.n_idgen_proyecto, \n\r' +
                        '           a.n_idgen_fase, \n\r' +
                        '           max(case when t.c_valor in (\'PI_Firma_Contrato\',\'ES_Suscripcion_Contrato\',\'EJ_Suscripcion_Contrato\') then tp.d_fechafin else null end) d_fechafirma, \n\r' +
                        '           max(case when t.c_valor in (\'PI_Inicio_Contrato\',\'ES_Inicio_ExpedienteTecnico\',\'EJ_Inicio_Obra\') then tp.d_fechafin else null end) d_fechainicio \n\r' +
                        '       from  \n\r' +
                        '           pro_tareaproyecto tp \n\r' +
                        '           inner join gen_tarea t on t.n_idgen_tarea = tp.n_idgen_tarea and t.n_borrado = 0 \n\r' +
                        '           inner join gen_actividad a on a.n_idgen_actividad = t.n_idgen_actividad and a.n_borrado = 0 \n\r' +
                        '       where \n\r' +
                        '           tp.n_borrado = 0 \n\r' +
                        '           and t.c_valor in (\'PI_Firma_Contrato\',\'PI_Inicio_Contrato\',\'PI_Ampliacion_Plazo\', \n\r' +
                        '                             \'ES_Suscripcion_Contrato\',\'ES_Inicio_ExpedienteTecnico\',\'ES_Ampliacion_Plazo\', \n\r' +
                        '                             \'EJ_Suscripcion_Contrato\',\'EJ_Inicio_Obra\',\'EJ_Aprobacion_Ampliacion_Plazo\') \n\r' +
                        '       group by \n\r' +
                        '           tp.n_idgen_proyecto, \n\r' +
                        '           a.n_idgen_fase \n\r' +
                        '       order by \n\r' +
                        '           a.n_idgen_fase, \n\r' +
                        '           tp.n_idgen_proyecto \n\r' +
                        '   ),	tareas_adicionales2 as (  \n\r' +
                        '       select \n\r' +
                        '           tp.n_idgen_proyecto, \n\r' +
                        '           a.n_idgen_fase, \n\r' +
                        '			max(case when t.c_valor in (\'PI_Firma_Contrato\',\'ES_Suscripcion_Contrato\',\'EJ_Suscripcion_Contrato\') and da.n_idgen_datoadicional in (13,103,211) then coalesce(replace(av.c_valor, \'null\', \'0\'), \'0\') :: float else 0 end) n_plazo, \n\r' +
                        '			sum(case when t.c_valor in (\'PI_Ampliacion_Plazo\',\'ES_Ampliacion_Plazo\',\'EJ_Aprobacion_Ampliacion_Plazo\') and da.n_idgen_datoadicional in (77,137,287) then coalesce(replace(av.c_valor, \'null\', \'0\'), \'0\') :: float else 0 end) n_ampliaciones \n\r' +
                        //'           sum(case when t.c_valor in (\'PI_Firma_Contrato\',\'ES_Suscripcion_Contrato\',\'EJ_Suscripcion_Contrato\') and da.n_idgen_datoadicional in (13,103,211) then av.c_valor :: float else 0 end) n_plazo, \n\r' +
                        //'           sum(case when t.c_valor in (\'PI_Ampliacion_Plazo\',\'ES_Ampliacion_Plazo\',\'EJ_Aprobacion_Ampliacion_Plazo\') and da.n_idgen_datoadicional in (77,137,287) then av.c_valor :: float else 0 end) n_ampliaciones \n\r' +
                        '       from  \n\r' +
                        '           pro_tareaproyecto tp \n\r' +
                        '           inner join gen_tarea t on t.n_idgen_tarea = tp.n_idgen_tarea and t.n_borrado = 0 \n\r' +
                        '           inner join gen_actividad a on a.n_idgen_actividad = t.n_idgen_actividad and a.n_borrado = 0 \n\r' +
                        '           inner join pro_adicionalvalor av on av.n_idpro_tareaproyecto = tp.n_idpro_tareaproyecto and av.n_borrado = 0  \n\r' +
                        '           inner join gen_datoadicional da on da.n_idgen_datoadicional = av.n_idgen_datoadicional and da.n_borrado = 0  \n\r' +
                        '               and da.n_idgen_datoadicional in (13,77,103,137,211,287) \n\r' +
                        '       where \n\r' +
                        '           tp.n_borrado = 0 \n\r' +
                        '           and t.c_valor in (\'PI_Firma_Contrato\',\'PI_Inicio_Contrato\',\'PI_Ampliacion_Plazo\', \n\r' +
                        '                             \'ES_Suscripcion_Contrato\',\'ES_Inicio_ExpedienteTecnico\',\'ES_Ampliacion_Plazo\', \n\r' +
                        '                             \'EJ_Suscripcion_Contrato\',\'EJ_Inicio_Obra\',\'EJ_Aprobacion_Ampliacion_Plazo\') \n\r' +
                        '       group by \n\r' +
                        '           tp.n_idgen_proyecto, \n\r' +
                        '           a.n_idgen_fase \n\r' +
                        '       order by \n\r' +
                        '           a.n_idgen_fase, \n\r' +
                        '           tp.n_idgen_proyecto \n\r' +
                        '   ),	fecha_max as (  \n\r' +
                        '       select  \n\r' +
                        '           t.n_idgen_fase,  \n\r' +
                        '           t.c_nombre c_fase,  \n\r' +
                        '           tp.n_idgen_proyecto,  \n\r' +
                        '           max(tp.d_fechafin) d_fecha  \n\r' +
                        '       from vw_tarea t  \n\r' +
                        '       inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0  \n\r' +
                        '       group by t.n_idgen_fase,t.c_nombre,tp.n_idgen_proyecto  \n\r' +
                        '   ),	db_max as (  \n\r' +
                        '       select  \n\r' +
                        '           tp.n_idgen_proyecto,  \n\r' +
                        '           max(t.n_orden) n_orden  \n\r' +
                        '       from vw_tarea t  \n\r' +
                        '       inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0 and tp.d_fechafin is not null  \n\r' +
                        '       group by tp.n_idgen_proyecto  \n\r' +
                        '   ),	base as (  \n\r' +
                        '       select  \n\r' +
                        '           distinct  \n\r' +
                        '           tp.n_idgen_proyecto,  \n\r' +
                        '           p.c_nombreproyecto,  \n\r' +
                        '           p.c_codigomem,  \n\r' +
                        '           p.c_codigocui,  \n\r' +
                        '           p.c_codigosnip,  \n\r' +
                        '           p.c_objetivoproyecto,  \n\r' +
                        '           l1.c_valorlista c_unidadformuladora,  \n\r' +
                        '           l2.c_valorlista c_unidadejecutora,  \n\r' +
                        '           l3.c_valorlista c_tipoejecucion,  \n\r' +
                        '           l4.c_valorlista c_fuentefinanciamiento,  \n\r' +
                        '           case  t.n_idgen_fase when 4 then 3 else t.n_idgen_fase end n_idgen_fase  \n\r' +
                        '       from vw_tarea t  \n\r' +
                        '       inner join pro_tareaproyecto tp on t.n_idgen_tarea = tp.n_idgen_tarea and tp.n_borrado = 0  \n\r' +
                        '       inner join gen_proyecto p on tp.n_idgen_proyecto = p.n_idgen_proyecto and p.n_borrado = 0  \n\r' +
                        '       inner join db_max mx on t.n_orden = mx.n_orden and tp.n_idgen_proyecto = mx.n_idgen_proyecto  \n\r' +
                        '       left outer join gen_lista l1 on p.n_id_unidadformuladora = l1.n_idgen_lista and  \n\r' +
                        '       l1.n_borrado = 0  \n\r' +
                        '       left outer  join gen_lista l2 on p.n_id_unidadejecutora = l2.n_idgen_lista and l2.n_borrado = 0  \n\r' +
                        '       left outer  join gen_lista l3 on p.n_id_tipoejecucion = l3.n_idgen_lista and l3.n_borrado = 0  \n\r' +
                        '       left outer  join gen_lista l4 on p.n_id_fuentefinanciamiento = l4.n_idgen_lista  \n\r' +
                        '       and l4.n_borrado = 0  \n\r' +
                        '   )  \n\r' +
                        '   select   \n\r' +
                        '       b.n_idgen_proyecto, b.n_idgen_fase ,b.c_nombreproyecto,to_char(fm.d_fecha, \'dd/mm/yyyy\') d_fecha,  \n\r' +
                        '       case when coalesce(it.n_montoinversiontotal, \'0\') <> \'\' then coalesce(it.n_montoinversiontotal, \'0\')::double precision else 0 end AS n_montoinversiontotal,  \n\r' +
                        '       case when coalesce(it.n_montoinversiontotal, \'0\') <> \'\' then coalesce(it.n_montoinversiontotal::double precision, \'0\')::double precision * 0.05::double precision else 0 end AS n_perfildefinitivo, \n\r' +
                        '		case when coalesce(it.n_montoinversiontotal, \'0\') <> \'\' then coalesce(it.n_montoinversiontotal::double precision, 0)::double precision * 0.1::double precision else 0 end AS n_supervisionobra,EXTRACT(DAY FROM age(now(),date(fm.d_fecha) ) ) n_diaatrasados,  \n\r' +
                        '       b.c_codigomem,b.c_codigocui,b.c_codigosnip,b.c_objetivoproyecto,b.c_unidadformuladora,b.c_unidadejecutora,b.c_tipoejecucion,b.c_fuentefinanciamiento,  \n\r' +
                        '       lum.n_valor n_luminarias,lp.n_valor n_lp,rp.n_valor n_rp,rs.n_valor n_rs, \n\r' +
                        '       coalesce(to_char(t1.d_fechafirma, \'DD/MM/YYYY\'), \'-\') as c_fechafirma, \n\r' +
                        '       coalesce(t2.n_plazo :: text, \'-\') as c_plazo, \n\r' +
                        '       coalesce(to_char(t1.d_fechainicio, \'DD/MM/YYYY\'), \'-\') as c_fechainicio, \n\r' +
                        '       coalesce(to_char((t1.d_fechainicio :: date + interval \'1\' day * t2.n_plazo) - interval \'1\' day, \'DD/MM/YYYY\'), \'-\') as d_fechafin, \n\r' +
                        '       coalesce(t2.n_ampliaciones :: text, \'-\') as c_ampliaciones, \n\r' +
                        '       coalesce(to_char(((t1.d_fechainicio :: date + interval \'1\' day * t2.n_plazo) - interval \'1\' day) + interval \'1\' day * t2.n_ampliaciones, \'DD/MM/YYYY\'), \'-\') as d_fechafinampliado \n\r' +
                        '   from base b  \n\r' +
                        '   left outer join inversion_total it on b.n_idgen_proyecto = it.n_idgen_proyecto and it.n_idgen_fase = b.n_idgen_fase  \n\r' +
                        '   left outer join vw_dashboard_linea lp on b.n_idgen_proyecto = lp.n_idgen_proyecto and lp.c_atributo = \'LP\' \n\r' +
                        '   left outer join vw_dashboard_linea rp on b.n_idgen_proyecto = rp.n_idgen_proyecto and rp.c_atributo = \'RP\'  \n\r' +
                        '   left outer join vw_dashboard_linea rs on b.n_idgen_proyecto = rs.n_idgen_proyecto and rs.c_atributo = \'RS\'  \n\r' +
                        '   left outer join vw_dashboard_luminaria lum on b.n_idgen_proyecto = lum.n_idgen_proyecto \n\r' +
                        '   left outer join tareas_adicionales1 t1 on t1.n_idgen_proyecto = b.n_idgen_proyecto and t1.n_idgen_fase = b.n_idgen_fase \n\r' +
                        '   left outer join tareas_adicionales2 t2 on t2.n_idgen_proyecto = b.n_idgen_proyecto and t2.n_idgen_fase = b.n_idgen_fase \n\r' +
                        '   inner join fecha_max fm on b.n_idgen_proyecto =  fm.n_idgen_proyecto and b.n_idgen_fase = fm.n_idgen_fase';
                    pool.query(cadena,
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                            } else {

                                detallefases = results.rows;
                                fases.forEach(fase => {
                                    let detalles = detallefases.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                    fase.detalles = detalles;
                                });
                                response.status(200).json({ estado: true, mensaje: "", data: fases })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_dato_fase_historico = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let fases = [];
        let detallefases = [];
        let montofases = [];
        pool.query('Select n_idgen_fase,c_nombre from gen_fase where n_borrado = 0 and n_idgen_fase not in (4)',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                } else {
                    fases = results.rows;
                    pool.query('select * from vw_lineatiempo_historico where n_idgen_proyecto=$1', [request.body.n_idgen_proyecto],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                            } else {
                                detallefases = results.rows;
                                pool.query('select * from vw_lienatiempo_historico_montos where n_idgen_proyecto=$1', [request.body.n_idgen_proyecto],
                                    (error, results) => {
                                        if (error) {
                                            response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null })
                                        } else {
                                            montofases = results.rows;
                                            fases.forEach(fase => {
                                                let detalles = detallefases.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                                let montos = montofases.filter(o => o.n_idgen_fase == fase.n_idgen_fase);
                                                fase.detalles = detalles;
                                                fase.montos = montos;
                                            });
                                            response.status(200).json({ estado: true, mensaje: "", data: fases })
                                        }
                                    })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const get_xls_formato_perfil = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            'n_idgen_proyecto, \n\r' +
            'c_nombreproyecto, \n\r' +
            'c_unidadformuladora, \n\r' +
            'c_unidadejecutora, \n\r' +
            'c_fuentefinanciamiento,  \n\r' +
            'n_montoinversiontotal,  \n\r' +
            'c_unidadmonto, \n\r' +
            'plazo,  \n\r' +
            'c_unidadplazo,  \n\r' +
            'c_codigocui, \n\r' +
            'd_inlusionpack, \n\r' +
            'd_convocatoria, \n\r' +
            'd_otorgamientobuenapro, \n\r' +
            'd_consentimientobuenapro, \n\r' +
            'd_suscripcioncontrato, \n\r' +
            'd_iniciocontrato, \n\r' +
            'd_fincontrato, \n\r' +
            'd_fincontratoampliado, \n\r' +
            'c_nrosolicitud, \n\r' +
            'c_contratista, \n\r' +
            'c_representantelegal, \n\r' +
            'c_direccion, \n\r' +
            'c_montocontrato, \n\r' +
            'c_plazo, \n\r' +
            'n_ampliacion, \n\r' +
            'c_objetivoproyecto \n\r' +
            'from vw_xls_formato_perfil   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0  and cp.n_idgen_fase = 1 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}
const get_xls_formato_diseno = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_diseno   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0 and cp.n_idgen_fase = 2 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_ejecucion = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_ejecucion   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0 and cp.n_idgen_fase = 2 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_cierre = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_cierre   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0 and cp.n_idgen_fase = 2 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_proyecto = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_proyecto   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0 and cp.n_idgen_fase = 2 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros = (request, response) => {
    var obj = valida.validaToken(request)
    let proyectos = [];
    let ubigeos = [];
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    let cadenaccpp = 'with base as ( \n\r' +
                        'select  \n\r' +
                        'c_departamento,  \n\r' +
                        'c_provincia,  \n\r' +
                        'c_distrito ,  \n\r' +
                        'count(c_centropoblado) cantidadccpp  \n\r' +
                        'from vw_ubigeo u  \n\r' +
                        'inner join pro_cpproyecto cp on u.n_idgen_centropoblado = cp.n_idgen_centropoblado and cp.n_borrado = 0 and cp.n_idgen_fase = 2 \n\r' +
                        'where cp.n_idgen_proyecto = ' + n_idgen_proyecto + '  \n\r' +
                        'group by c_departamento, c_provincia, c_distrito  \n\r' +
                        ') \n\r' +
                        'select 	c_departamento,  \n\r' +
                        'c_provincia, \n\r' +
                        'count(c_distrito) cantidaddistrito,  \n\r' +
                        'sum(cantidadccpp)   cantidadccpp \n\r' +
                        'from base  \n\r' +
                        'group by c_departamento,  \n\r' +
                        'c_provincia';

                    pool.query(cadenaccpp,
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                ubigeos = results.rows;
                                response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, ubigeos: ubigeos } })
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}
const get_xls_formato_obra = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_obra   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        //console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}
const get_xls_formato_obra_valorizacioncontractual = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_valorizacioncontractual   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const get_xls_formato_obra_presupuestoobra = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_presupuestoobra   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_obra_avanceprogramadovsrealejectutado = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_avanceprogramadovsrealejecutado   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_obra_valorizacionmayoresmetrados = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_valorizacionmayoresmetrados   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_obra_valorizacionpartidasadicionales = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_valorizacionpartidasadicionales   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_obra_adelantomateriales = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_adelantomateriales   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_obra_ampliacionplazo = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_ampliacionplazo   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_supervision   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision_avanceprogramadovsrealejecutado = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_supervision_avanceprogramadovsrealejecutado   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision_valorizacioncontractual = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_supervision_valorizacioncontractual   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision_mayorprestacion = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_supervision_mayorprestacion   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision_prestacionadicional = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_supervision_prestacionadicional   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_supervision_presupuestoobra = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_supervision_presupuestoobra   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const get_xls_formato_obra_supervision_garantias = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_obra_supervision_garantias   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros_amp_plazo = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros_amp_plazo   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros_mod_presupuestal = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros_mod_presupuestal   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros_adel_directo = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros_adel_directo   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros_adel_materiales = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros_adel_materiales   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_xls_formato_otros_emple_generados = (request, response) => {

    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        let cadena = 'select  \n\r' +
            '*  \n\r' +
            'from vw_xls_formato_otros_emple_generados   \n\r' +
            ' where n_idgen_proyecto=' + n_idgen_proyecto;

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                    console.log(cadena);
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_exportalldata2 = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_fase = request.body.n_idgen_fase;

        pool.query(
            'select * from vw_export_proyecto_all_xls \n\r' +
            'where (n_idgen_fase = $1 or 0 = $1) \n\r' +
            'order by cast(coalesce(c_codigomem, \'0\') as int), n_fila, n_idgen_fase', [n_idgen_fase],
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

const getUbigeoProyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        pool.query(
            '   ;with consulta as \n\r' +
            '   ( \n\r' +
            '       select 1 n_fila,* from fn_getubigeo($1,1) \n\r' +
            '       union \n\r' +
            '       select 2 n_fila,* from fn_getubigeo($1,2) \n\r' +
            '       union \n\r' +
            '       select 3 n_fila,* from fn_getubigeo($1,3) \n\r' +
            '   ) \n\r' +
            '   select n_fila, fn_getubigeo as c_ubigeo from consulta order by n_fila', [n_idgen_proyecto],
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

const get_exportdatosadicionales = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_fase = request.body.n_idgen_fase;
        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;

        pool.query(
            /*'WITH	consulta AS \n\r' +
            '( \n\r' +
            '    SELECT  \n\r' +
            '        pa.n_idgen_proyecto, \n\r' +
            '        p.c_nombreproyecto, \n\r' +
            '        p.c_codigomem, \n\r' +
            '        p.c_codigocui, \n\r' +
            '        a.n_idgen_fase, \n\r' +
            '        a.n_idpro_atributo, \n\r' +
            '        a.c_atributo, \n\r' +
            '        pa.c_valoratributo AS c_valor \n\r' +
            '    FROM  \n\r' +
            '        pro_atributo a \n\r' +
            '    INNER JOIN	pro_proyectoatributo pa ON a.n_idpro_atributo = pa.n_idpro_atributo AND pa.n_borrado = 0 \n\r' +
            '    INNER JOIN	gen_proyecto p on p.n_idgen_proyecto = pa.n_idgen_proyecto and p.n_borrado = 0 \n\r' +
            '    WHERE \n\r' +
            '        a.n_borrado = 0 \n\r' +
            '    ORDER BY \n\r' +
            '        pa.n_idgen_proyecto, \n\r' +
            '        a.n_idgen_fase, \n\r' +
            '        a.n_idpro_atributo \n\r' +
            ') \n\r' +
            'select  \n\r' +
            '    distinct \n\r' +
            '    p.n_idgen_proyecto, \n\r' +
            '    p.c_nombreproyecto, \n\r' +
            '    p.c_codigomem, \n\r' +
            '    p.c_codigocui, \n\r' +
            '    p.n_idgen_fase, \n\r' +
            '    p.n_idpro_atributo, \n\r' +
            '    p.c_atributo, \n\r' +
            '    p.c_valor \n\r' +
            'from  \n\r' +
            '    consulta p \n\r' +
            'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 \n\r' +
            'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado  \n\r' +
            'where  \n\r' +
            '    (coalesce(u.n_idgen_departamento, -100) = $1 or 0 = $1) \n\r' +
            '    and (u.n_idgen_provincia = $2 or 0 = $2) \n\r' +
            '    and (u.n_idgen_distrito = $3 or 0 = $3) \n\r' +
            '    and (u.n_idgen_centropoblado = $4 or 0 = $4) \n\r' +
            '    and (p.n_idgen_fase = $5 or 0 = $5) \n\r' +
            'ORDER BY \n\r' +
            '        p.n_idgen_proyecto, \n\r' +
            '        p.n_idgen_fase, \n\r' +
            '        p.n_idpro_atributo'*/

            'WITH	consulta AS \n\r' +
            '( \n\r' +
            '    SELECT \n\r' +
            '        pa.n_idgen_proyecto, \n\r' +
            '        p.c_nombreproyecto, \n\r' +
            '        p.c_codigomem, \n\r' +
            '        p.c_codigocui, \n\r' +
            '        a.n_idgen_fase, \n\r' +
            '        a.n_idpro_atributo, \n\r' +
            '        a.c_atributo, \n\r' +
            '        pa.c_valoratributo AS c_valor \n\r' +
            '    FROM \n\r' +
            '        pro_atributo a \n\r' +
            '    INNER JOIN	pro_proyectoatributo pa ON a.n_idpro_atributo = pa.n_idpro_atributo AND pa.n_borrado = 0 \n\r' +
            '    INNER JOIN	gen_proyecto p on p.n_idgen_proyecto = pa.n_idgen_proyecto and p.n_borrado = 0 \n\r' +
            '    WHERE \n\r' +
            '        a.n_borrado = 0 \n\r' +
            '    ORDER BY \n\r' +
            '        pa.n_idgen_proyecto, \n\r' +
            '        a.n_idgen_fase, \n\r' +
            '        a.n_idpro_atributo \n\r' +
            ') \n\r' +
            ',	consulta2 as \n\r' +
            '( \n\r' +
            '    select \n\r' +
            '        distinct \n\r' +
            '        p.n_idgen_proyecto, \n\r' +
            '        p.c_nombreproyecto, \n\r' +
            '        p.c_codigomem, \n\r' +
            '        p.c_codigocui, \n\r' +
            '        p.n_idgen_fase, \n\r' +
            '        p.n_idpro_atributo, \n\r' +
            '        p.c_atributo, \n\r' +
            '        p.c_valor \n\r' +
            '    from \n\r' +
            '        consulta p \n\r' +
            '    left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 \n\r' +
            '    left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado \n\r' +
            '    where \n\r' +
            '        (coalesce(u.n_idgen_departamento, -100) = $1 or 0 = $1) \n\r' +
            '        and (u.n_idgen_provincia = $2 or 0 = $2) \n\r' +
            '        and (u.n_idgen_distrito = $3 or 0 = $3) \n\r' +
            '        and (u.n_idgen_centropoblado = $4 or 0 = $4) \n\r' +
            '        and (p.n_idgen_fase = $5 or 0 = $5) \n\r' +
            '    ORDER BY \n\r' +
            '            p.n_idgen_proyecto, \n\r' +
            '            p.n_idgen_fase, \n\r' +
            '            p.n_idpro_atributo \n\r' +
            ') \n\r' +
            'select \n\r' +
            '    c.n_idgen_proyecto, \n\r' +
            '    c.c_nombreproyecto, \n\r' +
            '    c.c_codigomem, \n\r' +
            '    c.c_codigocui, \n\r' +
            '    max(p.n_idgen_fase) n_idgen_fase, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 then 1 else 0 end), 0) as fase1, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 then 1 else 0 end), 0) as fase2, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 then 1 else 0 end), 0) as fase3, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 then 1 else 0 end), 0) as fase4, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 then 1 else 0 end), 0) as fase5, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Jefatura\' then c_valor else \'-\' end), \'-\') as F1_A1, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Jefe de Area\' then c_valor else \'-\' end), \'-\') as F1_A2, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Coordinador\' then c_valor else \'-\' end), \'-\') as F1_A3, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Gerente Ingeniería\' then c_valor else \'-\' end), \'-\') as F1_A4, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Jefe Ingeniería\' then c_valor else \'-\' end), \'-\') as F1_A5, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'LP\' then c_valor else \'-\' end), \'-\') as F1_A6, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'LP Reforzamiento\' then c_valor else \'-\' end), \'-\') as F1_A7, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RP\' then c_valor else \'-\' end), \'-\') as F1_A8, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RP (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F1_A9, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RP (Nro Transformadores)\' then c_valor else \'-\' end), \'-\') as F1_A10, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RS\' then c_valor else \'-\' end), \'-\') as F1_A11, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RS (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F1_A12, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RS (Nro Luminarias)\' then c_valor else \'-\' end), \'-\') as F1_A13, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Inversión Incluye IGV\' then c_valor else \'-\' end), \'-\') as F1_A14, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Plazo de ejecución\' then c_valor else \'-\' end), \'-\') as F1_A15, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Ficha Técnica\' then c_valor else \'-\' end), \'-\') as F1_A16, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'Relación Localidades\' then c_valor else \'-\' end), \'-\') as F1_A17, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RS (Nro Usuarios)\' then c_valor else \'-\' end), \'-\') as F1_A78, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 1 and c_atributo = \'RS (Población Beneficiada)\' then c_valor else \'-\' end), \'-\') as F1_A83, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Jefatura\' then c_valor else \'-\' end), \'-\') as F2_A18, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Jefe de Area\' then c_valor else \'-\' end), \'-\') as F2_A19, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Coordinador\' then c_valor else \'-\' end), \'-\') as F2_A20, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Gerente Ingeniería\' then c_valor else \'-\' end), \'-\') as F2_A21, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Jefe Ingeniería\' then c_valor else \'-\' end), \'-\') as F2_A22, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'LP\' then c_valor else \'-\' end), \'-\') as F2_A23, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'LP Reforzamiento\' then c_valor else \'-\' end), \'-\') as F2_A24, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RP\' then c_valor else \'-\' end), \'-\') as F2_A25, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RP (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F2_A26, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RP (Nro Transformadores)\' then c_valor else \'-\' end), \'-\') as F2_A27, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RS\' then c_valor else \'-\' end), \'-\') as F2_A28, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RS (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F2_A29, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RS (Nro Luminarias)\' then c_valor else \'-\' end), \'-\') as F2_A30, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Valor Referencial incl. IGV\' then c_valor else \'-\' end), \'-\') as F2_A31, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Plazo de ejecución\' then c_valor else \'-\' end), \'-\') as F2_A32, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Ficha Técnica\' then c_valor else \'-\' end), \'-\') as F2_A33, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Relación Localidades\' then c_valor else \'-\' end), \'-\') as F2_A34, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Entidad licita Suministros, Obra Civiles y Montaje\' then c_valor else \'-\' end), \'-\') as F2_A35, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'Entidad que administra el Contrato\' then c_valor else \'-\' end), \'-\') as F2_A36, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RS (Nro Usuarios)\' then c_valor else \'-\' end), \'-\') as F2_A79, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 2 and c_atributo = \'RS (Población Beneficiada)\' then c_valor else \'-\' end), \'-\') as F2_A82, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Jefatura\' then c_valor else \'-\' end), \'-\') as F3_A37, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Jefe de Area\' then c_valor else \'-\' end), \'-\') as F3_A38, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Coordinador\' then c_valor else \'-\' end), \'-\') as F3_A39, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Gerente Obra\' then c_valor else \'-\' end), \'-\') as F3_A40, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Residente Obra\' then c_valor else \'-\' end), \'-\') as F3_A41, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'LP\' then c_valor else \'-\' end), \'-\') as F3_A42, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'LP Reforzamiento\' then c_valor else \'-\' end), \'-\') as F3_A43, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RP\' then c_valor else \'-\' end), \'-\') as F3_A44, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RP (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F3_A45, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RP (Nro Transformadores)\' then c_valor else \'-\' end), \'-\') as F3_A46, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RS\' then c_valor else \'-\' end), \'-\') as F3_A47, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RS (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F3_A48, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RS (Nro Luminarias)\' then c_valor else \'-\' end), \'-\') as F3_A49, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Costo Obra incl. IGV\' then c_valor else \'-\' end), \'-\') as F3_A50, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Plazo de ejecución\' then c_valor else \'-\' end), \'-\') as F3_A51, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Ficha Técnica\' then c_valor else \'-\' end), \'-\') as F3_A52, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'Relación Localidades\' then c_valor else \'-\' end), \'-\') as F3_A53, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RS (Nro Usuarios)\' then c_valor else \'-\' end), \'-\') as F3_A80, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 3 and c_atributo = \'RS (Población Beneficiada)\' then c_valor else \'-\' end), \'-\') as F3_A84, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Jefatura\' then c_valor else \'-\' end), \'-\') as F4_A54, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Jefe de Area\' then c_valor else \'-\' end), \'-\') as F4_A55, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Coordinador\' then c_valor else \'-\' end), \'-\') as F4_A56, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Gerente Supervisión\' then c_valor else \'-\' end), \'-\') as F4_A57, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Jefe Supervisión\' then c_valor else \'-\' end), \'-\') as F4_A58, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Costo Consultoria incl. IGV\' then c_valor else \'-\' end), \'-\') as F4_A59, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 4 and c_atributo = \'Plazo de ejecución\' then c_valor else \'-\' end), \'-\') as F4_A60, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Jefatura\' then c_valor else \'-\' end), \'-\') as F5_A61, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Jefe de Area\' then c_valor else \'-\' end), \'-\') as F5_A62, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Coordinador\' then c_valor else \'-\' end), \'-\') as F5_A63, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Gerente Obra\' then c_valor else \'-\' end), \'-\') as F5_A64, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Residente Obra\' then c_valor else \'-\' end), \'-\') as F5_A65, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'LP\' then c_valor else \'-\' end), \'-\') as F5_A66, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'LP Reforzamiento\' then c_valor else \'-\' end), \'-\') as F5_A67, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RP\' then c_valor else \'-\' end), \'-\') as F5_A68, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RP (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F5_A69, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RP (Nro Transformadores)\' then c_valor else \'-\' end), \'-\') as F5_A70, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RS\' then c_valor else \'-\' end), \'-\') as F5_A71, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RS (Nro Localidades)\' then c_valor else \'-\' end), \'-\') as F5_A72, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RS (Nro Luminarias)\' then c_valor else \'-\' end), \'-\') as F5_A73, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Costo Conforme a Obra Inc. IGV\' then c_valor else \'-\' end), \'-\') as F5_A74, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Plazo de ejecución\' then c_valor else \'-\' end), \'-\') as F5_A75, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Ficha Técnica\' then c_valor else \'-\' end), \'-\') as F5_A76, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'Relación Localidades\' then c_valor else \'-\' end), \'-\') as F5_A77, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RS (Nro Usuarios)\' then c_valor else \'-\' end), \'-\') as F5_A81, \n\r' +
            '    coalesce(max(case when c.n_idgen_fase = 5 and c_atributo = \'RS (Población Beneficiada)\' then c_valor else \'-\' end), \'-\') as F5_A85 \n\r' +
            'from \n\r' +
            '    consulta2 c inner join vw_proyecto p on p.n_idgen_proyecto = c.n_idgen_proyecto\n\r' +
            'group by \n\r' +
            '    c.n_idgen_proyecto, \n\r' +
            '    c.c_nombreproyecto, \n\r' +
            '    c.c_codigomem, \n\r' +
            '    c.c_codigocui \n\r' +
            'order by \n\r' +
            '    cast(c.c_codigomem as int)'
            , [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase],
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

const getUbigeoProyecto_xls = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        pool.query(
            '   with	fases as \n\r' +
            '   ( \n\r' +
            '       SELECT  \n\r' +
            '           row_number() OVER (PARTITION BY vw_proyecto_ubigeo.n_idgen_proyecto ORDER BY vw_proyecto_ubigeo.n_idgen_fase DESC) AS fila, \n\r' +
            '           vw_proyecto_ubigeo.n_idgen_fase, \n\r' +
            '           vw_proyecto_ubigeo.n_idgen_proyecto \n\r' +
            '       FROM  \n\r' +
            '           vw_proyecto_ubigeo \n\r' +
            '       WHERE \n\r' +
            '           vw_proyecto_ubigeo.n_idgen_proyecto = $1 \n\r' +
            '       GROUP BY  \n\r' +
            '           vw_proyecto_ubigeo.n_idgen_fase, vw_proyecto_ubigeo.n_idgen_proyecto \n\r' +
            '   ) \n\r' +
            '   ,	consulta as \n\r' +
            '   ( \n\r' +
            '       select  \n\r' +
            '           distinct  \n\r' +
            '           u.n_idgen_proyecto, \n\r' +
            '           v.c_nombreproyecto, \n\r' +
            '           v.c_codigocui, \n\r' +
            '           v.c_codigomem, \n\r' +
            '           u.n_idgen_departamento,			 \n\r' +
            '           p.c_nombre c_departamento, \n\r' +
            '           pr.c_nombre c_provincia, \n\r' +
            '           d.c_nombre c_distrito, \n\r' +
            '           cp.c_nombre c_centropoblado \n\r' +
            '       from  \n\r' +
            '           vw_proyecto_ubigeo u \n\r' +
            '       inner join	fases f on f.n_idgen_proyecto = u.n_idgen_proyecto and f.n_idgen_fase = u.n_idgen_fase and f.fila = 1 \n\r' +
            '       inner join	gen_departamento p on p.n_idgen_departamento = u.n_idgen_departamento \n\r' +
            '       inner join	gen_provincia pr on pr.n_idgen_provincia = u.n_idgen_provincia \n\r' +
            '       inner join	gen_distrito d on d.n_idgen_distrito = u.n_idgen_distrito \n\r' +
            '       inner join	gen_centropoblado cp on cp.n_idgen_centropoblado = u.n_idgen_centropoblado \n\r' +
            '       inner join	vw_proyecto v on v.n_idgen_proyecto = u.n_idgen_proyecto \n\r' +
            '       where  \n\r' +
            '           u.n_idgen_proyecto = $1 \n\r' +
            '   ) \n\r' +
            '   select \n\r' +
            '       row_number() over (order by c_departamento, c_provincia, c_distrito) idrow, \n\r' +
            '       *  \n\r' +
            '   from consulta', [n_idgen_proyecto],
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

module.exports = {
    get,
    get_lista,
    getid,
    getid_dos,
    get_tarea_proyecto,
    get_tarea_proyecto_registro,
    get_tarea_edit_proyecto_registro,
    getusuarioproyecto,
    guardarusuarioproyecto,
    save,
    save_tarea_proyecto,
    save_tarea_proyecto_individual,
    delete_tarea_proyecto_individual,
    save_valor_datoadicional,
    delete_proyecto,
    get_proyecto_atributo,
    get_proyecto_atributo_file,
    get_datoadicional_registro,
    fechar_tarea,
    get_dato_fase,
    get_dato_fase_historico,
    get_xls_formato_perfil,
    get_xls_formato_diseno,
    get_xls_formato_ejecucion,
    get_xls_formato_cierre,
    get_xls_formato_proyecto,
    get_xls_formato_otros,
    get_xls_formato_obra,
    get_situacion,
    save_situacion,
    get_xls_formato_obra_valorizacioncontractual,
    get_xls_formato_obra_presupuestoobra,
    get_xls_formato_obra_avanceprogramadovsrealejectutado,
    get_xls_formato_obra_valorizacionmayoresmetrados,
    get_xls_formato_obra_valorizacionpartidasadicionales,
    get_xls_formato_obra_adelantomateriales,
    get_xls_formato_obra_ampliacionplazo,
    save_orden,
    get_xls_formato_obra_ampliacionplazo,
    get_xls_formato_supervision,
    get_xls_formato_supervision_avanceprogramadovsrealejecutado,
    get_xls_formato_supervision_valorizacioncontractual,
    get_xls_formato_supervision_mayorprestacion,
    get_xls_formato_supervision_prestacionadicional,
    get_xls_formato_supervision_presupuestoobra,
    get_xls_formato_obra_supervision_garantias,
    get_cartafianza,
    get_tipocarta,
    save_cartafianza,
    delete_cartafianza,
    get_exportalldata,
    delete_situacion,
    get_xls_formato_otros_amp_plazo,
    get_xls_formato_otros_mod_presupuestal,
    get_xls_formato_otros_adel_directo,
    get_xls_formato_otros_adel_materiales,
    get_xls_formato_otros_emple_generados,
    get_exportalldata2,
    getUbigeoProyecto,
    get_exportdatosadicionales,
    getUbigeoProyecto_xls
}
