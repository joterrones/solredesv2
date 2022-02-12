const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const get = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    if(request.body.n_idpl_tipoarmado==null){
      request.body.n_idpl_tipoarmado=0;
    }
    if(request.body.n_version==null){
      request.body.n_version=0;
    }
  
    pool.query('SELECT a.n_idpl_armado,a.c_codigo,a.c_nombre,a.c_codigo_corto,a.c_iconomapa,a.c_rutaimg,a.n_idpl_tipoarmado,a.b_especial,a.n_version, ta.c_codigo as c_codigotipoarmado,a.n_idpro_proyecto,a.c_nombrelamina FROM pl_armado a  '+
    'inner join pl_tipoarmado ta on a.n_idpl_tipoarmado = ta.n_idpl_tipoarmado and ta.n_borrado = 0 '+
    'where a.n_borrado = 0 and (a.n_idpl_tipoarmado=$1 or 0=$1) and (a.n_version=$2 or 0=$2) and a.n_idpro_proyecto = $3' +
    'order by ta.c_codigo asc', 
    [request.body.n_idpl_tipoarmado,request.body.n_version, request.body.n_idpro_proyecto],(error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los datos del armado!.",data:null})
      }else{
      response.status(200).json({estado:true,mensaje:"",data:results.rows})
      }
    })
  }
  
  const insert = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    let n_idpl_armado = request.body.n_idpl_armado;
    let c_codigo = request.body.c_codigo;
    let c_nombre = request.body.c_nombre;
    let c_codigo_corto = request.body.c_codigo_corto;
    let c_iconomapa = request.body.c_iconomapa;
    let c_rutaimg = request.body.c_rutaimg;
    let c_nombrelamina = request.body.c_nombrelamina;
    let n_idpro_proyecto = request.body.n_idpro_proyecto;
    let n_idpl_tipoarmado = request.body.n_idpl_tipoarmado;
    let n_version = request.body.n_version;

    let cadena = 'do $$ \n\r' +
    '   begin \n\r' +
    '       if(exists(select n_idpl_armado from pl_armado where n_borrado = 0 and n_idpl_armado ='+ n_idpl_armado +')) then \n\r' +
    '           update pl_armado set c_codigo= \'' + c_codigo + '\', c_nombre=\''+ c_nombre +'\', c_codigo_corto=\''+ c_codigo_corto +'\', c_iconomapa=\''+ c_iconomapa +'\', c_rutaimg=\''+ c_rutaimg +'\', n_idpl_tipoarmado='+n_idpl_tipoarmado+', n_version='+ n_version +', c_nombrelamina=\''+ c_nombrelamina +'\' \n\r' +
    '                  where n_idpl_armado =\'' + n_idpl_armado + '\'; \n\r' +
    '       else \n\r' +
    '           INSERT INTO pl_armado (n_idpl_armado,c_codigo,c_nombre,c_codigo_corto,c_iconomapa,c_rutaimg,c_nombrelamina,n_idpl_tipoarmado,n_version,n_borrado,d_fechacrea, n_id_usercrea)\n\r' +
    '           values (default,\'' + c_codigo + '\',\'' + c_nombre + '\',\''+ c_codigo_corto +'\', \''+ c_iconomapa+'\',\''+ c_rutaimg +'\',\''+ c_nombrelamina +'\','+ n_idpl_tipoarmado +',\''+ n_version +'\', 0, now(), 1);\n\r' +
    '       end if; \n\r' +
    '   end \n\r' +
    '$$';

    pool.query(cadena,
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(200).json({estado:false,mensaje:"ocurrio un error al guardar el armado!.", data:null})
            }else{
            response.status(200).json({estado:true,mensaje:"", data:results.rows})
            }
    })
  }

  const deleteArmado = (request,response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_armado set n_borrado= $1 where n_idpl_armado= $1',[request.body.n_idpl_armado],
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
  
  const gettipoarmado = (request, response) => {   
    //pool = cnx.dynamic_connection(request.body.proyecto);
    pool.query('SELECT n_idpl_tipoarmado,c_codigo,c_nombre FROM pl_tipoarmado where n_borrado = 0 ORDER BY c_nombre ASC', (error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los datos del tipo armado!.",data:null})
      }else{
      response.status(200).json({estado:true,mensaje:"",data:results.rows})
      }
    })
  }
  
  const getversion = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    pool.query('SELECT n_version FROM pl_armado where n_borrado = 0 GROUP BY n_version order by n_version asc', (error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los versión del armado!.",data:null})
      }else{
      response.status(200).json({estado:true,mensaje:"",data:results.rows})
      }
    })
  }
  
  const getconfigarmado = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    if(request.body.n_idpl_armado==null){
      request.body.n_idpl_armado=0
    }
    pool.query('Select e.n_idpl_elemento,e.c_codigo,e.c_nombre,e.c_unidadmedida, coalesce(ea.n_cantidad,0) n_cantidad , true guardado from pl_elemento e '+
    'left outer join pl_armadoelemento ea on e.n_idpl_elemento = ea.n_idpl_elemento and ea.n_borrado = 0 and ea.n_idpl_armado =$1'+
    'where e.n_borrado=0',
    [request.body.n_idpl_armado]
    ,(error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los datos del armado!.",data:null})
      }else{
      response.status(200).json({estado:true,mensaje:"",data:results.rows})
      }
    })
  }
  
  const insertconfigarmado = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    var n_idpl_armado = request.body.n_idpl_armado
    var n_idpl_elemento = request.body.n_idpl_elemento
    var n_cantidad = parseFloat(request.body.n_cantidad)
  
    pool.query('SELECT n_idpl_armadoelemento FROM pl_armadoelemento where n_borrado = 0 and n_idpl_armado=$1 and n_idpl_elemento=$2',[n_idpl_armado,n_idpl_elemento], (error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los versión del armado!.",data:null})
      }else{
        console.log("Entro")
        if(results.rows.length==0){
          console.log("Insertando")
            pool.query('INSERT INTO pl_armadoelemento(n_idpl_armadoelemento,n_idpl_armado,n_idpl_elemento,n_cantidad,n_borrado,n_id_usercrea,d_fechacrea) VALUES (default, $1, $2, $3, 0, 1, now()) RETURNING *',
              [n_idpl_armado,n_idpl_elemento,n_cantidad], (error, results) => {
              if (error) {
                response.status(200).json({estado:false,mensaje:"ocurrio un error al guardar el armado!.", data:null})
              }else{
                response.status(200).json({estado:true,mensaje:"", data:results.rows})
              }
            })
        }else{
          console.log("ACtualizando")
          pool.query('UPDATE pl_armadoelemento set n_cantidad = $3 where n_idpl_armado=$1 and n_idpl_elemento=$2 RETURNING *',
              [n_idpl_armado,n_idpl_elemento,n_cantidad], (error, results) => {
              if (error) {
                response.status(200).json({estado:false,mensaje:"ocurrio un error al config armado!.", data:null})
              }else{
                response.status(200).json({estado:true,mensaje:"", data:results.rows})
              }
            })  
        }
  
      }
    })
  }
  
  
  const getconfigtipomontaje = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    if(request.body.n_idpl_armado==null){
      request.body.n_idpl_armado=0;
    }
    pool.query('select '+
      'ctm.n_orden, '+
      'm.n_idmon_tipomontaje, '+
      'm.c_codigo, '+
      'm.c_nombre, '+
      'atm.n_idpl_armadotipomontaje is not null estado '+
    'from mon_tipomontaje m '+
      'inner join mon_categoriatipomontaje ctm on m.n_idmon_categoriatipomontaje = ctm.n_idmon_categoriatipomontaje and ctm.n_borrado = 0 '+
      'left outer join pl_armadotipomontaje atm on m.n_idmon_tipomontaje = atm.n_idmon_tipomontaje and atm.n_borrado = 0 and atm.n_idpl_armado = $1 '+
    'where  '+
      'm.n_borrado = 0 '+
      'order by 	 '+
      'Left(m.c_codigo,2), '+
      'ctm.n_orden,  '+
    'Cast(Replace(Replace(Replace(m.c_codigo,\'LP_\',\'\'),\'RP_\',\'\'),\'RS_\',\'\') as float) ' ,
  [request.body.n_idpl_armado]
      , (error, results) => {
        if (error) {
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos generales!.", data: null })
        } else {
          response.status(200).json({ estado: true, mensaje: "", data: results.rows })
        }
      })
  }
  
  const insertarmadoconfigmontaje = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    var n_idpl_armado = request.body.n_idpl_armado
    var n_idmon_tipomontaje = request.body.n_idmon_tipomontaje
    var estado = request.body.estado
    pool.query('SELECT n_idpl_armadotipomontaje FROM pl_armadotipomontaje where n_borrado = 0 and n_idpl_armado=$1 and n_idmon_tipomontaje=$2',[n_idpl_armado,n_idmon_tipomontaje], (error, results) => {
      if (error) {
        response.status(200).json({estado:false,mensaje:"ocurrio un error al traer los versión del armado!.",data:null})
      }else{
    
        if(results.rows.length==0){
          console.log("Insertando")
          if(estado){
            pool.query('INSERT INTO pl_armadotipomontaje(n_idpl_armadotipomontaje,n_idpl_armado,n_idmon_tipomontaje,n_borrado,n_id_usercrea,d_fechacrea) VALUES (default, $1, $2, 0, 1, now()) RETURNING *',
              [n_idpl_armado,n_idmon_tipomontaje], (error, results) => {
              if (error) {
                response.status(200).json({estado:false,mensaje:"ocurrio un error al guardar el armado!.", data:null})
              }else{
                response.status(200).json({estado:true,mensaje:"", data:results.rows})
              }
            })
          }
          else{
            response.status(200).json({estado:false,mensaje:"No se ha insertado!.", data:null})
          }
        }else{
          console.log("Eliminado")
          if(!estado){
          pool.query('DELETE FROM pl_armadotipomontaje  where n_idpl_armado=$1 and n_idmon_tipomontaje=$2 RETURNING *',
              [n_idpl_armado,n_idmon_tipomontaje], (error, results) => {
              if (error) {
                response.status(200).json({estado:false,mensaje:"ocurrio un error al config armado!.", data:null})
              }else{
                response.status(200).json({estado:true,mensaje:"", data:results.rows})
              }
            })  
          }else{
            response.status(200).json({estado:false,mensaje:"No se ha eliminado!.", data:null})
          }
        }
  
      }
    })
  }
  
  
  module.exports = {
    get,
    insert,
    gettipoarmado,
    getversion,
    getconfigarmado,
    insertconfigarmado,
    getconfigtipomontaje,
    insertarmadoconfigmontaje,
    deleteArmado
  }