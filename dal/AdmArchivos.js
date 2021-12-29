const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const getArchivo = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select ar.id_archivo, ar.id_carpeta, ar.c_nombre, ar.c_ruta, ar.d_fechamodi from archivo ar \n\r' +
            'inner join carpeta ca on ca.id_carpeta = ar.id_carpeta \n\r' +            
            'where ar.n_borrado = 0 and (ar.id_carpeta = $1 or 0 = $1)'
        pool.query(cadena,[request.body.id_carpeta],            
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

    /*const fs = require('fs');

        fs.readdir("./archivos/proyectos",(error, files)=>{
            if(error){
                throw error
            }
            console.log(files);
            console.log("finalizando Lectura");
            
        })
        console.log("iniciando lectura")        */

    
}

const getCarpetas = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select id_carpeta, c_nombre, d_fechamodi from carpeta where n_borrado= 0' 
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

const saveCarpeta = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let id_carpeta = request.body.id_carpeta;   
        let c_nombre = request.body.c_nombre;   
       
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select id_carpeta from carpeta where n_borrado = 0 and id_carpeta =\'' + id_carpeta + '\')) then \n\r' +
            '           update carpeta set c_nombre= \'' + c_nombre + '\', d_fechamodi= now() where id_carpeta =\'' + id_carpeta + '\'; \n\r' +
            '       else \n\r' +
            '           insert into carpeta(id_carpeta, c_nombre, n_borrado, d_fechacrea, d_fechamodi, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), now(), 1); \n\r' +
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

const deleteCarpeta = (request,response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update carpeta set n_borrado= $1 where id_carpeta= $1',[request.body.id_carpeta],
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

const saveArchivo = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let id_archivo = request.body.id_archivo;   
        let id_carpeta = request.body.id_carpeta;   
        let c_nombre = request.body.c_nombre;
        let c_ruta = request.body.c_ruta;
        console.log("ID: ",id_carpeta);
        console.log("IDarchivo: ",id_archivo);
        console.log("NOMBRE: ",c_nombre);
        console.log("RUTA: ",c_ruta);

        let cadena ='do $$ \n\r' +
        '   begin \n\r' +
        '       if(exists(select id_archivo from archivo where n_borrado = 0 and id_archivo =\'' + id_archivo + '\')) then \n\r' +
        '           update archivo set id_carpeta= \''+ id_carpeta +'\', c_nombre= \'' + c_nombre + '\', d_fechamodi= now() where id_archivo =\'' + id_archivo + '\'; \n\r' +
        '       else \n\r' +
        '           insert into archivo(id_archivo, id_carpeta, c_nombre, c_ruta, n_borrado, d_fechacrea, d_fechamodi, n_id_usercrea) \n\r' +
        '           values (default,'+ id_carpeta +',\'' + c_nombre + '\',\''+ c_ruta +'\',0, now(), now(), 1); \n\r' +
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
    if (obj.estado) {
        pool.query('delete from archivo where id_archivo= $1',[request.body.id_archivo],
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

module.exports = {
    getArchivo,
    getCarpetas,
    saveCarpeta,
    deleteCarpeta,
    saveArchivo,
    deleteArchivo
}