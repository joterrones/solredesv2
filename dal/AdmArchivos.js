const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const getArchivo = (request, response)=>{
    var obj = valida.validaToken(request)
    let n_iddoc_archivopadre = request.body.n_iddoc_archivopadre;
    console.log(n_iddoc_archivopadre)
    if (obj.estado) {
        
        /*let cadena = 'select n_iddoc_archivo, n_idpro_proyecto, c_nombre, c_ruta, c_rutalogica, c_checksum, c_tipo, n_iddoc_archivopadre from doc_archivo \n\r' +           
            'where n_borrado = 0 and ( 0 = '+  n_iddoc_archivopadre +' or n_iddoc_archivopadre =' +n_iddoc_archivopadre+')';*/
            let cadena = 'select n_iddoc_archivo, n_idpro_proyecto, c_nombre, c_ruta, c_rutalogica, c_checksum, c_tipo, n_iddoc_archivopadre from doc_archivo \n\r' +           
            'where n_borrado = 0 and  coalesce(n_iddoc_archivopadre,0) =' + n_iddoc_archivopadre ;
        pool.query(cadena,          
            (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })    
                } else {     
                                
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }    
}

const saveArchivo = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_iddoc_archivo = request.body.n_iddoc_archivo;  
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let c_nombre = request.body.c_nombre; 
        let c_ruta = request.body.c_ruta;
        let c_rutalogica = request.body.c_rutalogica;   
        let c_checksum = request.body.c_checksum;
        let c_tipo = request.body.c_tipo;
        let n_iddoc_archivopadre = request.body.n_iddoc_archivopadre;
        let n_id_usermodi = request.body.n_id_usermodi;
        console.log("Padre",n_iddoc_archivopadre);

        let cadena ='do $$ \n\r' +
        '   begin \n\r' +
        '       if(exists(select n_iddoc_archivo from doc_archivo where n_borrado = 0 and n_iddoc_archivo =\'' + n_iddoc_archivo + '\')) then \n\r' +
        '           update doc_archivo set c_nombre= \''+ c_nombre +'\', c_rutalogica= \'' + c_rutalogica + '\', n_iddoc_archivopadre=\''+ n_iddoc_archivopadre +'\', n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_iddoc_archivo =\'' + n_iddoc_archivo + '\'; \n\r' +
        '       else \n\r' +
        '           insert into doc_archivo(n_iddoc_archivo, n_idpro_proyecto, c_nombre, c_ruta, c_rutalogica, c_checksum, c_tipo, n_iddoc_archivopadre, n_borrado, d_fechacrea, d_fechamodi, n_id_usercrea) \n\r' +
        '           values (default,'+ n_idpro_proyecto +',\'' + c_nombre + '\',\''+ c_ruta +'\', \''+ c_rutalogica +'\',\''+ c_checksum +'\', \''+ c_tipo +'\','+ n_iddoc_archivopadre+', 0, now(), now(), '+n_id_usermodi+'); \n\r' +
        '       end if; \n\r' +
        '   end \n\r' +
        '$$';        
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error3!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deleteArchivo = (request,response) =>{
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_iddoc_archivo = request.body.n_iddoc_archivo;
    if (obj.estado) {
        pool.query('update doc_archivo set n_borrado = 1, n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_iddoc_archivo ='+n_iddoc_archivo+' ',
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

const getCarpetas = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let cadena = 'select n_iddoc_archivo, c_nombre, n_iddoc_archivopadre from doc_archivo \n\r' +            
            'where c_tipo = \''+ "3" +'\' or ( n_borrado = 0 and c_tipo = \''+ "1" +'\' )'
        pool.query(cadena,         
            (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })    
                } else {     
                                
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


module.exports = {
    getArchivo,
    saveArchivo,
    deleteArchivo,
    getCarpetas
}