const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const get = (request, response) => {
  //pool = cnx.dynamic_connection(request.body.proyecto);
  
  pool.query('select p.n_idpl_elemento,p.c_unidadmedida,p.c_codigo,p.c_nombre,p.b_partidanueva,p.c_material,p.c_esfuerzo,p.c_altura,p.c_seccionconductor from pl_elemento p ' +
            ' inner join pl_tipoelemento tp on tp.n_idpl_tipoelemento =  p.n_idpl_tipoelemento and tp.n_borrado = 0 '+
            ' where p.n_borrado = 0 and tp.n_idpro_proyecto = $1 and (p.n_idpl_tipoelemento = $2 or 0 = $2) ORDER BY left(p.c_codigo,2) asc,Cast(REPLACE(REPLACE(REPLACE(p.c_codigo,\'LP_\',\'\'),\'RP_\',\'\'),\'RS_\',\'\') as Float) asc ',
            [request.body.n_idpro_proyecto, request.body.n_idpl_tipoelemento],
            (error, results) => {
    if (error) {
      console.log(error);
      response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del elemento!.", data: null })
    } else {

      var array = [];
      results.rows.forEach(element => {

        if (element.c_material != null) {
          var res = element.c_material.split(",");
          var array_material = [];
          res.forEach(item => {
            array_material.push(item)
          });
          element.array_material = array_material;
        }else{
          element.array_material = [];
        }

        if (element.c_esfuerzo != null) {
          var res = element.c_esfuerzo.split(",");
          var array_esfuerzo = [];
          res.forEach(item => {
            array_esfuerzo.push(item)
          });
          element.array_esfuerzo = array_esfuerzo;
        }else{
          element.array_esfuerzo = [];
        }

        if (element.c_altura != null) {
          var res = element.c_altura.split(",");
          var array_altura = [];
          res.forEach(item => {
            array_altura.push(item)
          });
          element.array_altura = array_altura;
        }else{
          element.array_altura = [];
        }

        if (element.c_seccionconductor != null) {
          var res = element.c_seccionconductor.split(",");
          var array_seccionconductor = [];
          res.forEach(item => {
            array_seccionconductor.push(item)
          });
          element.array_seccionconductor = array_seccionconductor;
        }else{
          element.array_seccionconductor = [];
        }
        element.guardado=true;
        array.push(element);

      });

      response.status(200).json({ estado: true, mensaje: "", data: array })

    }
  })
}

const updateconfig = (request, response) => {
  //pool = cnx.dynamic_connection(request.body.proyecto);
  if (request.body.c_material == null) {
    request.body.c_material = "";
  }
  if (request.body.c_esfuerzo == null) {
    request.body.c_esfuerzo = "";
  }
  if (request.body.c_altura == null) {
    request.body.c_altura = "";
  }
  if (request.body.c_seccionconductor == null) {
    request.body.c_seccionconductor = "";
  }
  console.log(request.body.c_material);
  pool.query('update pl_elemento set c_material=$2, c_esfuerzo=$3, c_altura=$4, c_seccionconductor=$5, b_partidanueva=$6, n_id_usermodi=$7, d_fechamodi= now() where n_idpl_elemento =$1 RETURNING *',
    [request.body.n_idpl_elemento, request.body.c_material, request.body.c_esfuerzo, request.body.c_altura, request.body.c_seccionconductor, request.body.b_partidanueva,request.body.n_id_usermodi], (error, results) => {
      if (error) {
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al actualizar el elemento!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}

const getTipoElemento = (request, response) => {
  
  pool.query('select n_idpl_tipoelemento, c_codigo, split_part(c_codigo,\'_\',1) as div, split_part(c_codigo,\'_\',2)::DECIMAL as div2,c_nombre from pl_tipoelemento ' + 
            'where n_borrado = 0 and n_idpro_proyecto = $1 ' +
            'order by div asc, div2 asc',
    [request.body.n_idpro_proyecto], (error, results) => {
      if (error) {
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al actualizar el elemento!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}


module.exports = {
  get,
  updateconfig,
  getTipoElemento
}