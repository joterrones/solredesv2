const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;


const get = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    pool.query('SELECT n_idgen_valoresgenerales,c_codigo,c_nombre, n_valorunico FROM gen_valoresgenerales where n_borrado = 0  ORDER BY n_idgen_valoresgenerales ASC'
        , (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos generales!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const getzona = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    pool.query('SELECT n_idpl_zona,c_codigo,c_nombre FROM pl_zona where n_borrado = 0  ORDER BY n_idpl_zona ASC'
        , (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer zona!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const gettipolinea = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    pool.query('SELECT n_idpl_tipolinea,c_codigo,c_nombre FROM pl_tipolinea where n_borrado = 0  ORDER BY n_idpl_tipolinea ASC'
        , (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer tipolinea!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const getlinea = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    if (request.body.n_idpl_tipolinea == null) {
        request.body.n_idpl_tipolinea = 0
    }
    if (request.body.n_idpl_zona == null) {
        request.body.n_idpl_zona = 0
    }
    pool.query('SELECT n_idpl_linea,c_codigo,c_nombre,n_idpl_tipolinea,n_idpl_zona FROM pl_linea where n_borrado = 0 and (n_idpl_tipolinea=$1 or 0=$1) and (n_idpl_zona=$2 or 0=$2)  ORDER BY n_idpl_linea ASC',
        [request.body.n_idpl_tipolinea, request.body.n_idpl_zona], (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer tipolinea!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

module.exports = {

    get,
    getzona,
    gettipolinea,
    getlinea
}

//CD