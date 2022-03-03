const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const get = (request, response) => {
    if (request.body.n_idpl_linea == null) {
      request.body.n_idpl_linea == 0
    }
    if (request.body.n_version == null) {
      request.body.n_version == 0
    }
  
    pool.query('select  ' +
      'p.c_codigo c_codigoestructura, ' +
      'p.n_idpl_estructura, ' +
      'p.c_latitud, ' +
      'p.c_longitud, ' +
      'a.c_codigo, ' +
      'a.c_iconomapa, ' +
      'coalesce(ea.n_orientacion,0) n_orientacion ' +
      'from vw_planos p ' +
      'inner join pl_estructuraarmado ea on p.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0 ' +
      'inner join pl_armado a on ea.n_idpl_armado = a.n_idpl_armado and a.n_borrado = 0 ' +
      'where  ' +
      'p.n_idpl_linea=$1 and  ' +
      'p.n_version=$2 and  ' +
      'a.c_iconomapa is not null  ' +
      'and a.c_iconomapa<> \'\'',
      [request.body.n_idpl_linea, request.body.n_version]
      , (error, results) => {
        if (error) {
          console.log(error);
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
        } else {
          response.status(200).json({ estado: true, mensaje: "", data: results.rows })
        }
      })
  }

  const getdetalle = (request, response) => {
    if (request.body.n_idpl_estructura == null) {
      request.body.n_idpl_estructura == 0
    }
  
    pool.query('select a.c_codigo,a.c_nombre,ea.n_idpl_estructuraarmado, ea.n_cantidad, coalesce(ea.n_orientacion,0) n_orientacion from pl_armado a '+
    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado and ea.n_borrado = 0 '+
    'where a.n_borrado = 0 and ea.n_idpl_estructura = $1 order by a.c_nombre asc',
      [request.body.n_idpl_estructura]
      , (error, results) => {
        if (error) {
          console.log(error);
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
        } else {
          response.status(200).json({ estado: true, mensaje: "", data: results.rows })
        }
      })
  }

  
const getlineas = (request, response) => {

    if (request.body.n_idpl_linea == null) {
      request.body.n_idpl_linea == 0
    }
    if (request.body.n_version == null) {
      request.body.n_version == 0
    }
  
    pool.query('select cast(ei.c_longitud as Float) c_longitudinicio,cast(ei.c_latitud as Float) c_latitudinicio,cast(ef.c_longitud as Float) c_longitudfin,cast(ef.c_latitud as Float) c_latitudfin,p.c_codigotipolinea from vw_planos p ' +
      'inner join pl_subtramo s on p.n_idpl_estructura  = s.n_idpl_estructurainicio and s.n_borrado = 0 ' +
      'inner join pl_estructura ei on s.n_idpl_estructurainicio = ei.n_idpl_estructura and  ei.n_borrado = 0 ' +
      'inner join pl_estructura ef on s.n_idpl_estructurafin = ef.n_idpl_estructura and  ef.n_borrado = 0 ' +
      'where  ' +
      'p.n_idpl_linea=$1 and  ' +
      'p.n_version=$2 ',
      [request.body.n_idpl_linea, request.body.n_version]
      , (error, results) => {
        if (error) {
          console.log(error);
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
        } else {
          let polilineas = [];
          results.rows.forEach(element => {
           let objentidad = {
              path: [{
                c_latitud: element.c_latitudinicio,
                c_longitud: element.c_longitudinicio
              }, {
                c_latitud: element.c_latitudfin,
                c_longitud: element.c_longitudfin
              }]
            };
            polilineas.push(objentidad);
          });
          response.status(200).json({ estado: true, mensaje: "", data: polilineas })
        }
      })
  }

const getestructura = (request, response) => {
  if (request.body.n_idpl_estructura == null) {
    request.body.n_idpl_estructura == 0
  }

  pool.query('select c_nombre, c_codigo from pl_estructura  '+
  'where n_idpl_estructura = $1 and n_borrado = 0',
    [request.body.n_idpl_estructura]
    , (error, results) => {
      if (error) {
        console.log(error);
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}

const buscarLinea = (request, response) => {
  if (request.body.n_idpl_linea == null) {
    request.body.n_idpl_linea == 0
  }
  if (request.body.n_version == null) {
    request.body.n_version == 0
  }
  let nomBuscar = '%'+ request.body.nomBuscar+'%';
  pool.query('select  ' +
    'p.c_codigo c_codigoestructura, ' +
    'p.n_idpl_estructura, ' +
    'p.c_latitud, ' +
    'p.c_longitud, ' +
    'a.c_codigo, ' +
    'a.c_iconomapa, ' +
    'coalesce(ea.n_orientacion,0) n_orientacion ' +
    'from vw_planos p ' +
    'inner join pl_estructuraarmado ea on p.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0 ' +
    'inner join pl_armado a on ea.n_idpl_armado = a.n_idpl_armado and a.n_borrado = 0 ' +
    'where  ' +
    'p.n_idpl_linea=$1 and  ' +
    'p.n_version=$2 and  ' +
    'p.c_codigo like \''+nomBuscar+'\' and '+
    'a.c_iconomapa is not null  ' +
    'and a.c_iconomapa<> \'\'',
    [request.body.n_idpl_linea, request.body.n_version]
    , (error, results) => {
      if (error) {
        console.log(error);
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}

const insertOrientacion = (request, response) => {
  if (request.body.n_idpl_estructuraarmado == null) {
    request.body.n_idpl_estructuraarmado == 0
  }

  if (request.body.n_orientacion == null) {
    request.body.n_orientacion == 0
  }

  pool.query('update pl_estructuraarmado set n_orientacion = $1 where n_idpl_estructuraarmado = $2 ',
    [request.body.n_orientacion, request.body.n_idpl_estructuraarmado]
    , (error, results) => {
      if (error) {
        console.log(error);
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos para el mapa!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}

const buscarEstruct = (request, response) => {
  var obj = valida.validaToken(request)
  buscar = '%'+ request.body.c_nombre + '%';
    if (obj.estado) {
        pool.query('select pe.c_nombre, pe.c_codigo, pe.c_latitud, pe.c_longitud, l.n_idpl_linea, tpl.n_idpl_tipolinea, z.n_idpl_zona, z.n_idpro_proyecto from pl_estructura pe ' +
            'inner join pl_linea l on pe.n_idpl_linea = l.n_idpl_linea and l.n_borrado = 0 ' +
            'inner join pl_tipolinea tpl on tpl.n_idpl_tipolinea = l.n_idpl_tipolinea and tpl.n_borrado = 0 '+
            'inner join pl_zona z on z.n_idpl_zona = l.n_idpl_zona and z.n_borrado = 0 ' +
            'where pe.n_borrado = 0 and (pe.n_version = $1 or 0 = $1) and (tpl.n_idpl_tipolinea = $2 or 0 = $2) and (z.n_idpro_proyecto = $3 or 0 = $3) '+
            'and (z.n_idpl_zona = $4 or 0 = $4) and pe.c_nombre like \''+buscar+'\' and (l.n_idpl_linea = $5 or 0 = $5)',
            [request.body.n_version, request.body.n_idpl_tipolinea, request.body.n_idpro_proyecto, request.body.n_idpl_zona, request.body.n_idpl_linea],
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al buscar.", data: null })
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
    getlineas,
    getdetalle,
    getestructura,
    buscarLinea,
    insertOrientacion,
    buscarEstruct
}
