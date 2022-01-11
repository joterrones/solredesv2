const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const get = (request, response) => {
  //pool = cnx.dynamic_connection(request.body.proyecto);
  pool.query('select n_idpl_elemento,c_unidadmedida,c_codigo,c_nombre,b_partidanueva,c_material,c_esfuerzo,c_altura,c_seccionconductor from pl_elemento where n_borrado = 0 ORDER BY left(c_codigo,2) asc,Cast(REPLACE(REPLACE(REPLACE(c_codigo,\'LP_\',\'\'),\'RP_\',\'\'),\'RS_\',\'\') as Float) asc', (error, results) => {
    if (error) {
      response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del armado!.", data: null })
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

  pool.query('update pl_elemento set c_material=$2, c_esfuerzo=$3, c_altura=$4, c_seccionconductor=$5, b_partidanueva=$6 where n_idpl_elemento =$1 RETURNING *',
    [request.body.n_idpl_elemento, request.body.c_material, request.body.c_esfuerzo, request.body.c_altura, request.body.c_seccionconductor, request.body.b_partidanueva], (error, results) => {
      if (error) {
        response.status(200).json({ estado: false, mensaje: "ocurrio un error al actualizar el elemento!.", data: null })
      } else {
        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
      }
    })
}


module.exports = {
  get,
  updateconfig
}