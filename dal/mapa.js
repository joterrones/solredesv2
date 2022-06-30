const { response } = require('express');
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
    'where a.n_borrado = 0 and ea.n_idpl_estructura = $1 and a.c_codigo != \''+''+'\' and a.c_codigo != \''+'undefined'+'\' order by a.c_nombre asc',
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

  const getdetallemon = (request, response) => {
    if (request.body.n_idmon_inspeccion == null) {
      request.body.n_idmon_inspeccion == 0
    }

    pool.query('select m.c_codigo as c_codigomon, a.c_codigo as c_codigoar, mdtll.n_cantidad, mdtll.n_orientacion from mon_inspeccion m ' +
    'inner join mon_inspecciondetalle mdtll on mdtll.n_idmon_inspeccion = m.n_idmon_inspeccion and mdtll.n_borrado = 0 '+
    'inner join pl_armado a on a.n_idpl_armado = mdtll.n_idpl_armado and a.n_borrado = 0 '+
    'where m.n_idmon_inspeccion = $1',
      [request.body.n_idmon_inspeccion]
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
            'where pe.n_borrado = 0 and (pe.n_version = $1 or 0 = $1) and ( 0 = $3 or tpl.n_idpl_tipolinea = $3)  '+
            'and (z.n_idpro_proyecto = $2) and (0 = $4 or z.n_idpl_zona = $4 ) and pe.c_nombre like \''+buscar+'\'  '+
            'and (0=$5 or l.n_idpl_linea = $5 )',
            [request.body.n_version, request.body.n_idpro_proyecto,request.body.n_idpl_tipolinea,request.body.n_idpl_zona,request.body.n_idpl_linea],
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

const getZona = (request, response) => {

  var obj = valida.validaToken(request)
  if (obj.estado) {
      pool.query('select count(z.c_nombre), z.c_nombre, z.n_idpro_proyecto from pl_estructura pe ' +
            'inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0 '+
            'inner join pl_tipolinea tp on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and tp.n_borrado = 0 '+
            'inner join pl_zona z on pl.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 '+
            'where pe.n_borrado = 0 and pe.n_idpl_linea is not null and z.n_idpro_proyecto = $1 '+
            'group by z.c_nombre, z.n_idpro_proyecto ',
            [request.body.n_idpro_proyecto],
          (error, results) => {

              if (error) {
                  console.log(error);
                  response.status(200).json({ estado: false, mensaje: "DB: error al traer Zonas!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}

const gettipolinea = (request, response) => {
  var obj = valida.validaToken(request)
  if (obj.estado) {
      pool.query('select count(tp.c_nombre), tp.c_nombre from pl_estructura pe '+
                'inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0 '+
                'inner join pl_tipolinea tp on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and tp.n_borrado = 0 '+
                'inner join pl_zona z on pl.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 '+
                'where pe.n_borrado = 0 and pe.n_idpl_linea is not null '+
                'group by tp.c_nombre ',
          (error, results) => {
              if (error) {
                  response.status(200).json({ estado: false, mensaje: "DB: error al traer TP!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}

const getLinea = (request, response) => {
  var obj = valida.validaToken(request)
  if (obj.estado) {

      let cadena = 'select count(pl.c_nombre), pl.c_nombre from pl_estructura pe '+
                'inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0 '+ 
                'inner join pl_tipolinea tp on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and tp.n_borrado = 0 '+ 
                'inner join pl_zona z on pl.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 ' +
                'where pe.n_borrado = 0 and pe.n_idpl_linea is not null and z.n_idpro_proyecto = $1 '+
                'group by pl.c_nombre';
      pool.query(cadena,
          [request.body.n_idpro_proyecto],
          (error, results) => {
              if (error) {
                  console.log(cadena);
                  console.log(error);
                  response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}

const getLineaFiltro = (request, response) => {
  var obj = valida.validaToken(request)
  if (obj.estado) {

      let cadena = 'select pl.n_idpl_linea, pl.c_nombre from pl_linea pl '+
                'inner join pl_tipolinea tp on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and tp.n_borrado = 0 '+ 
                'inner join pl_zona z on pl.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 ' +
                'where pl.n_borrado = 0 and z.n_idpro_proyecto = $1 and '+
                '(0=$2 or z.n_idpl_zona=$2) and (0=$3 or tp.n_idpl_tipolinea = $3) ';
      pool.query(cadena,
          [request.body.n_idpro_proyecto,request.body.n_idpl_zona,request.body.n_idpl_tipolinea],
          (error, results) => {
              if (error) {
                  console.log(cadena);
                  console.log(error);
                  response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}



const getestructura2 = (request, response) => {

  var obj = valida.validaToken(request)
  if (obj.estado) {
    let c_nombreLinea = request.body.c_nombreLinea;

      let cadena = 'select count(pe.c_nombre), pe.c_nombre from pl_estructura pe '+
              'inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0 '+
              'inner join pl_tipolinea tp on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and tp.n_borrado = 0 '+
              'inner join pl_zona z on pl.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 '+
              'where pe.n_borrado = 0 and pe.n_idpl_linea is not null and pl.c_nombre = \''+ c_nombreLinea +'\' '+
              'group by pe.c_nombre' ;
      pool.query(cadena,          
          (error, results) => {
              if (error) {
                  console.log(cadena);
                  console.log(error);
                  response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}

const getMonInspeccion =  (request, response) => {
  var obj = valida.validaToken(request)
  if (obj.estado) {    
    let cadena = 'select m.n_idmon_inspeccion, m.c_codigo, m.c_latitud, m.c_longitud, m.n_precision, m.n_altitud, to_char(m.d_fechacrea, \'DD/MM/YYYY HH12:MI:SS\') as d_fechacrea, m.n_idpl_linea, m.n_tipoapp, pl.c_codigo as c_codigol, pl.c_nombre as c_nombrel, pt.c_codigo as c_codigotl, pt.c_nombre as c_nombretl, z.c_codigo as c_codigoz, su.c_username, su.c_nombre1, su.c_nombre2, su.c_appaterno, su.c_apmaterno  from mon_inspeccion m \n\r' +
		  'inner join pl_linea pl on pl.n_idpl_linea = m.n_idpl_linea and pl.n_borrado = 0 \n\r' +
		  'inner join pl_tipolinea pt on pt.n_idpl_tipolinea = pl.n_idpl_tipolinea and pt.n_borrado = 0 \n\r' +
		  'inner join pl_zona z ON pl.n_idpl_zona = z.n_idpl_zona AND z.n_borrado = 0 \n\r' +
      'inner join seg_userprofile su on su.n_idseg_userprofile = m.n_id_usercrea and su.n_borrado = 0 \n\r' +
	  'where m.n_borrado = 0 and (pl.n_idpl_linea = $1 or 0 = $1) and (pt.n_idpl_tipolinea = $2 or 0 = $2) and (z.n_idpl_zona = $3 or 0 = $3) and z.n_idpro_proyecto = $4 \n\r' +
    'order by m.n_idmon_inspeccion desc ';

    pool.query(cadena,[request.body.n_idpl_linea, request.body.n_idpl_tipolinea, request.body.n_idpl_zona, request.body.n_idpro_proyecto],   
        (error, results) => {
            if (error) {
                console.log(cadena);
                console.log(error);
                response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
  } else {
      response.status(200).json(obj)
  }
}

const getLineasMon = (request, response) => {
  var obj = valida.validaToken(request)
  if (obj.estado) {  
    let cadena = 'select pl.n_idpl_linea, pl.c_codigo, pl.c_nombre, count(pl.c_codigo) from mon_inspeccion m \n\r' +
        'inner join pl_linea pl on pl.n_idpl_linea = m.n_idpl_linea and pl.n_borrado = 0 \n\r' +
        'group by pl.n_idpl_linea, pl.c_nombre \n\r' +
        'order by pl.c_codigo ' ;
      pool.query(cadena,          
          (error, results) => {
              if (error) {
                  console.log(cadena);
                  console.log(error);
                  response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
              } else {
                  response.status(200).json({ estado: true, mensaje: "", data: results.rows })
              }
          })
  } else {
      response.status(200).json(obj)
  }
}

const getinspeccionxls= async (request, response) => {
  var session = valida.validaToken(request)
  if(session.estado){
    console.log("getinspeccionxls", request.body)
    let query = await pool.query('select * from vw_inspeccionxls '+
    'where (0 = $1 or n_idpl_tipolinea = $1) '+
    'and (0 = $2 or n_idpl_zona =$2) ' +  
    'and (0 = $3 or n_idpl_linea=$3) ' +
    'and n_idpro_proyecto=$4 ',[
      request.body.n_idpl_tipolinea,
      request.body.n_idpl_zona,
      request.body.n_idpl_linea,
      request.body.n_idpro_proyecto,
    ])
    console.log("getinspeccionxls", query.rows)
    response.status(200).json({ estado: true, mensaje: "", data: query.rows })

  }else{
    response.status(200).json(session)
  }
}


module.exports = {
    get,
    getlineas,
    getdetalle,
    getdetallemon,
    getestructura,
    buscarLinea,
    insertOrientacion,
    buscarEstruct,
    getZona,
    gettipolinea,
    getLinea,
    getLineaFiltro,
    getestructura2,
    getMonInspeccion,
    getLineasMon,
    getinspeccionxls
}
