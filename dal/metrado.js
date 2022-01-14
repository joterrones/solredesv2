const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const get = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    if (request.body.n_idpl_tipolinea == null) {
      request.body.n_idpl_tipolinea = 0;
    }
    if (request.body.n_idpl_linea == null) {
      request.body.n_idpl_linea = 0;
    }
    if (request.body.n_version == null) {
      request.body.n_version = 0;
    }
    console.log(request.body.n_idpl_tipolinea);
    var tipoelementos, elementos;
    pool.query('select n_idpl_tipoelemento,c_codigo,c_nombre,n_orden from pl_tipoelemento where n_borrado = 0 and (n_idpl_tipolinea=$1 ) order by n_orden ',
      [request.body.n_idpl_tipolinea], (error, results) => {
        if (error) {
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del metrado!: " + error.stack, data: null })
        } else { 

          this.tipoelementos = results.rows;
          let n_version = request.body.n_version;
          let n_idpl_linea = request.body.n_idpl_linea;
          let cadena = 'select ' +
          '	  n_idpl_elemento ' +
          '	  ,c_codigoelemento c_codigo ' +
          '	  ,n_idpl_tipoelemento ' +
          '	  ,c_nombreelemento c_nombre ' +
          '	  ,c_unidadmedida ' +
          '	  ,SUM( coalesce(n_cantidad,0)) cantidad ' +
          'from vw_metradoestructura  ' +
          'where	' +
          ' 	n_version = ' + n_version + ' ' +
          '	  and n_idpl_linea = ' + n_idpl_linea + ' ' +
          'group by ' +
          '	n_idpl_tipoelemento ' +
          ' 	,n_idpl_elemento ' +
          '	  ,c_codigoelemento ' +
          '  	,c_nombreelemento ' +
          '  	,c_unidadmedida ';
          pool.query(cadena,            
             (error, results) => {
              if (error) {
                console.log(error);                  
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del metrado!.", data: null })
              } else {
                var array = [];
                this.elementos = results.rows;
                this.tipoelementos.forEach(tipoelemento => {  
                  var elementosadd = this.elementos.filter(function (item) {
                    return item.n_idpl_tipoelemento == tipoelemento.n_idpl_tipoelemento
                  })
                  tipoelemento.isGroupBy = true
                  array.push(tipoelemento)
                  elementosadd.forEach(element => {
                    element.isGroupBy = false
                    array.push(element)
                  });
  
                });
                response.status(200).json({ estado: true, mensaje: "", data: array })
              }
            })
        }
      })
  }
  
  const getmontaje = (request, response) => {
    //pool = cnx.dynamic_connection(request.body.proyecto);
    console.log("idtipoLinea",request.body.n_idpl_tipolinea);
    console.log("idVersion",request.body.n_version);
    console.log("idLinea",request.body.n_idpl_linea );

    if (request.body.n_idpl_tipolinea == null) {
      request.body.n_idpl_tipolinea = 0;
    }
    if (request.body.n_idpl_linea == null) {
      request.body.n_idpl_linea = 0;
    }
    if (request.body.n_version == null) {
      request.body.n_version = 0;
    }
    var tipoelementos, elementos;
   
    pool.query('select n_idmon_categoriatipomontaje n_idpl_tipoelemento,c_codigo ,c_nombre ,n_orden  from mon_categoriatipomontaje where n_borrado = 0 and (n_idpl_tipolinea=$1 or $1 = 0) order by n_orden ',
      [request.body.n_idpl_tipolinea], (error, results) => {
        if (error) {
            console.log(error);
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del metrado!: " + error.stack, data: null })
        } else { 
          this.tipoelementos = results.rows;
          pool.query(
            'select  '+
               'n_idmon_tipomontaje  n_idpl_elemento'+
                ',c_codigotipomontaje c_codigo  '+
                ',n_idmon_categoriatipomontaje n_idpl_tipoelemento'+
                ',c_nombretipomontaje c_nombre  '+
                ',c_unidadmedida  '+
                ',SUM( coalesce(n_cantidad,0)) cantidad  '+
              'from vw_metradomontaje  '+
              'where '+
              'n_version = $1  '+
                'and n_idpl_linea = $2 '+
              'group by  '+
              'n_idmon_tipomontaje  '+
              ',c_codigotipomontaje  '+
                ',n_idmon_categoriatipomontaje  '+
                ',c_nombretipomontaje '+
              ',c_unidadmedida ',
            [request.body.n_version, request.body.n_idpl_linea], (error, results) => {
              if (error) {
                  console.log(error);
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos del metrado!.", data: null })
              } else {
                var array = [];
                this.elementos = results.rows;
                this.tipoelementos.forEach(tipoelemento => {
  
                  var elementosadd = this.elementos.filter(function (item) {
                    return item.n_idpl_tipoelemento == tipoelemento.n_idpl_tipoelemento
                  })
                  tipoelemento.isGroupBy = true
                  array.push(tipoelemento)
                  elementosadd.forEach(element => {
                    element.isGroupBy = false
                    array.push(element)
                  });
  
                });
                response.status(200).json({ estado: true, mensaje: "", data: array })
              }
            })
        }
      })
  }
  
  
  const gettipolinea = (request, response) => {
  
    pool.query('SELECT n_idpl_tipolinea,c_codigo,c_nombre FROM pl_tipolinea where n_borrado = 0  ORDER BY n_idpl_tipolinea ASC'
      , (error, results) => {
        if (error) {
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos generales!.", data: null })
        } else {
          response.status(200).json({ estado: true, mensaje: "", data: results.rows })
        }
      })
  }
  
  
  const getestructurametrado = (request, response) => {
    var estructuras,metrados;
    pool.query(
      'select distinct ' +
      '   n_idpl_estructura,  ' +
      '   c_codigoestructura c_codigo,  ' +
      '   c_nombreestructura c_nombre  ' +
      'from vw_metradoestructura   ' +
      'where   ' +
      '   n_idpl_elemento = $1  ' +
      '   and n_idpl_linea = $2  ' +
      '   and n_version = $3 '
      , [request.body.n_idpl_elemento, request.body.n_idpl_linea, request.body.n_version]
      , (error, results) => {
        if (error) {
          response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de estructuras!.", data: null })
        } else {
          this.estructuras=results.rows;
   
          pool.query(
            'select '+
            '   n_idpl_estructura, '+
            '   n_idpl_elemento, '+
            '   c_tipo, '+
            '   c_codigoelemento, '+
            '   c_nombreelemento, '+
            '   c_codigoarmado c_codigo, '+
            '   c_unidadmedida, '+
            '   n_cantidad '+
            'from vw_metradoestructura  '+
            'where  '+
            '   n_idpl_linea = $1  ' +
            '   and n_version = $2 '+
            '   and n_cantidad <> 0 '+
            'order by c_tipo,c_codigoarmado,c_nombreelemento '
            , [request.body.n_idpl_linea, request.body.n_version]
            , (error, results) => {
              if (error) {
                response.status(200).json({ estado: false, mensaje: "ocurrio un error al traer los datos de estructuras!.", data: null })
              } else {
                var array = [];
                this.metrados = results.rows;
             
                this.estructuras.forEach(estructura => {
              
                  var metradosadd = this.metrados.filter(function (item) {
                    return item.n_idpl_estructura == estructura.n_idpl_estructura
                  });
               
                  estructura.metrado=metradosadd;
                  array.push(estructura)
                });
  
                response.status(200).json({ estado: true, mensaje: "", data: array })
              }
            })
        }
      })
  }

  module.exports = {
    get,
    getmontaje,
    gettipolinea,
    getestructurametrado
   
  }