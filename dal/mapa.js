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
  
    pool.query('select a.c_codigo,a.c_nombre, ea.n_cantidad from pl_armado a '+
    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado and ea.n_borrado = 0 '+
    'where a.n_borrado = 0 and ea.n_idpl_estructura = $1',
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

module.exports = {
    get,
    getlineas,
    getdetalle
}
