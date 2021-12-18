const jwt = require('jsonwebtoken')
const encriptar = require('../common/encriptar')
const cnx = require('../common/appsettings')
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const login = (request, response) => {
    request.body.c_clave = encriptar.encriptarlogin(request.body.c_clave);
    pool.query('Select n_idseg_userprofile, c_username, c_nombre1,c_nombre2, c_appaterno, c_apmaterno, b_activo from seg_userprofile where n_borrado = 0 and c_username = $1 and c_clave = $2',
        [request.body.c_username, request.body.c_clave], (error, results) => {
            if (error) {
                response.status(200).json({ estado: false, mensaje: "error: usuario o contraseña inválidos!.", data: null })
            } else {
                if (results.rowCount > 0) {
                    var tokenData = {
                        username: request.body.c_username
                    }
                    var token = jwt.sign(tokenData, 'Secret Password', {
                        expiresIn: 60 * 60 * 4 // expires in 4 hours
                    })
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows[0], token: token })
                } else {
                    response.status(200).json({ estado: false, mensaje: "DB:usuario o contraseña inválidos!.", data: null })
                }
            }
        })
}

const get = (request, response) => {
    var obj = valida.validaToken(request)    
    if (obj.estado) {
        let cadena = 'Select u.n_idseg_userprofile, u.c_username, u.c_nombre1, u.c_appaterno, u.c_dni, r.c_nombre, u.c_clave, u.n_id_usermodi from seg_userprofile as u \n\r' +
            'left join seg_rol r on r.n_idseg_rol = u.n_idseg_rol \n\r' +            
            'where u.n_borrado = 0 and (u.n_idseg_rol = $1 or 0 = $1)'
        pool.query(cadena,
            [request.body.n_idseg_rol],/*, request.body.n_idgen_entidad*/
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })    
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const save = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let c_username = request.body.c_username;
        let c_clave = encriptar.encriptarlogin(request.body.c_clave);
        let c_nombre1 = request.body.c_nombre1;
        let c_appaterno = request.body.c_appaterno;
        let c_dni = request.body.c_dni;
        let n_idseg_userprofile = request.body.n_idseg_userprofile;
        /*let c_phone = request.body.c_phone;*/
        let n_idseg_rol = request.body.n_idseg_rol;
        /*let n_idgen_entidad = request.body.n_idgen_entidad;*/

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idseg_userprofile from seg_userprofile where n_borrado = 0 and n_idseg_userprofile =\'' + n_idseg_userprofile + '\')) then \n\r' +
            '           update seg_userprofile set c_nombre1= \'' + c_nombre1 + '\', c_appaterno=\'' + c_appaterno + '\', c_dni=\'' + c_dni + '\', n_idseg_rol=' + n_idseg_rol +',c_username=\'' + c_username + '\' where n_idseg_userprofile =\'' + n_idseg_userprofile + '\'; \n\r' +
            '       else \n\r' +
            '           insert into seg_userprofile(n_idseg_userprofile,c_username,c_clave,c_nombre1,c_appaterno,c_dni,n_idseg_rol,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_username + '\',\'' + c_clave + '\',\'' + c_nombre1 + '\',\'' + c_appaterno + '\',\'' + c_dni + '\', '+ n_idseg_rol +', 0,now(),1); \n\r' +
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

const delete_usuario = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idseg_userprofile = request.body.n_idseg_userprofile;
        console.log(n_idseg_userprofile)
        pool.query('update seg_userprofile set n_borrado = n_idseg_userprofile where n_idseg_userprofile = $1', [n_idseg_userprofile],            
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error4!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getrole = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idseg_rol, c_nombre, n_nivel from seg_rol where (n_idseg_rol= $1 or 0 = $1) ',[request.body.n_idseg_rol],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveRol = (request, response)=>{
    
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idseg_rol = request.body.n_idseg_rol;
        let c_nombre = request.body.c_nombre;
        let n_nivel = request.body.n_nivel;    
        console.log(n_idseg_rol)        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idseg_rol from seg_rol where n_idseg_rol =\'' + n_idseg_rol + '\')) then \n\r' +
            '           update seg_rol set c_nombre= \'' + c_nombre + '\', n_nivel=\'' + n_nivel + '\' where n_idseg_rol = \''+n_idseg_rol+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into seg_rol(n_idseg_rol,c_nombre,n_nivel) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + n_nivel + '\'); \n\r' +
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

const deleteRol=(request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idseg_rol = request.body.n_idseg_rol;
        console.log(n_idseg_rol)
        pool.query('delete from seg_rol where n_idseg_rol = $1', [n_idseg_rol],            
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error4!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}




const resetearclave = (request, response) => {
    
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let c_username = request.body.username;
        let c_clave = encriptar.encriptarlogin(request.body.password);
        let c_oldpassword = encriptar.encriptarlogin(request.body.oldpassword);
        let esreset = request.body.esreset;
        /*console.log(c_username);
        console.log(c_clave);
        console.log(c_oldpassword);*/
        if (!esreset) {
            pool.query('Select n_idseg_userprofile from seg_userprofile where n_borrado = 0 and c_username = $1 and c_clave = $2',
                [c_username, c_oldpassword], (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "error: usuario o contraseña inválidos!.", data: null })
                    } else {
                        if (results.rowCount > 0) {
                            pool.query('update seg_userprofile set c_clave = $2 where c_username = $1;', [c_username, c_clave],
                                (error, results) => {
                                    if (error) {
                                        response.status(200).json({ estado: false, mensaje: "DB: error!5.", data: null })
                                    } else {
                                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                                    }
                                })
                        } else {
                            response.status(200).json({ estado: false, mensaje: "DB: Contraseña no válida!.", data: null })
                        }
                    }
                })
        } else {
            pool.query('update seg_userprofile set c_clave = $2 where c_username = $1;', [c_username, c_clave],
                (error, results) => {
                    if (error) {
                        response.status(200).json({ estado: false, mensaje: "DB: error6!.", data: null })
                    } else {
                        response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                    }
                })
        }


    } else {
        response.status(200).json(obj)
    }
}



module.exports = {
    login,
    get,
    getrole,
    save,
    resetearclave,
    delete_usuario,
    saveRol,
    deleteRol
}
