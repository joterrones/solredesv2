const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const getempresa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idgen_empresa, c_nombrecorto, c_ruc, c_razonsocial, n_borrado from gen_empresa where n_borrado = 0',
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

const saveEmpresa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_empresa = request.body.n_idgen_empresa;
        let c_nombrecorto = request.body.c_nombrecorto;
        let c_ruc = request.body.c_ruc;    
        let c_razonsocial = request.body.c_razonsocial;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_empresa from gen_empresa where n_idgen_empresa =\'' + n_idgen_empresa + '\')) then \n\r' +
            '           update gen_empresa set c_nombrecorto= \'' + c_nombrecorto + '\', c_ruc=\'' + c_ruc + '\', c_razonsocial=\'' + c_razonsocial + '\' where n_idgen_empresa = \''+ n_idgen_empresa +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_empresa(n_idgen_empresa, c_nombrecorto,c_ruc, c_razonsocial, n_borrado,d_fechacrea) \n\r' +
            '           values (default,\'' + c_nombrecorto + '\',\'' + c_ruc + '\',\'' + c_razonsocial + '\', 0,now()); \n\r' +
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

const deleteEmpresa = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update gen_empresa set n_borrado= $1 where n_idgen_empresa= $1',[request.body.n_idgen_empresa],
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

const getLinea = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let cadena = 'Select l.n_idpl_linea, l.c_nombre, l.c_codigo, tp.c_nombre as c_nombret from pl_linea as l \n\r' +
            'left join pl_tipolinea tp on tp.n_idpl_tipolinea = l.n_idpl_tipolinea \n\r' +            
            'where l.n_borrado = 0 and (l.n_idpl_linea = $1 or 0 = $1)'
        pool.query(cadena,
            [request.body.n_idpl_tipolinea],/*, request.body.n_idgen_entidad*/
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

const saveLinea = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_linea = request.body.n_idpl_linea;   
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;     
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;       
       
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_linea from pl_linea where n_borrado = 0 and n_idpl_linea =\'' + n_idpl_linea + '\')) then \n\r' +
            '           update pl_linea set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_idpl_tipolinea=' + n_idpl_tipolinea +' where n_idpl_linea =\'' + n_idpl_linea + '\'; \n\r' +
            '       else \n\r' +
            '           insert into pl_linea(n_idpl_linea,c_nombre,c_codigo,n_idpl_tipolinea,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',' + n_idpl_tipolinea + ', 0, now(), 1); \n\r' +
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
const deleteLinea = (request,response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_linea set n_borrado= $1 where n_idpl_linea= $1',[request.body.n_idpl_linea],
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

const gettipolinea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idpl_tipolinea, c_nombre from pl_tipolinea where n_borrado = 0 and (n_idpl_tipolinea= $1 or 0 = $1) ',[request.body.n_idpl_tipolinea],
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

const saveTipoLinea = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
        let c_nombre = request.body.c_nombre;          
             
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_tipolinea from pl_tipolinea where n_idpl_tipolinea =\'' + n_idpl_tipolinea + '\')) then \n\r' +
            '           update pl_tipolinea set c_nombre= \'' + c_nombre + '\' where n_idpl_tipolinea = \''+n_idpl_tipolinea+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_tipolinea(n_idpl_tipolinea,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), 1); \n\r' +
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

const deleteTipoLinea= (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_tipolinea set n_borrado= $1 where n_idpl_tipolinea= $1',[request.body.n_idpl_tipolinea],
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

const getZona = (request, response) => {
    
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select z.n_idpl_zona, z.n_idpl_proyecto, z.c_codigo, z.c_nombre, pr.c_nombre as c_nombrep from pl_zona z \n\r' +
        'left join pl_proyecto pr on pr.n_idpl_proyecto = z.n_idpl_proyecto \n\r' +            
        'where z.n_borrado = 0 and (z.n_idpl_zona = $1 or 0 = $1)'
        ,[request.body.n_idpl_zona],
            (error, results) => {
                
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error222!.", data: null })
                } else {                    
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveZona = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_zona = request.body.n_idpl_zona;
        let n_idpl_proyecto = request.body.n_idpl_proyecto;
        let c_codigo = request.body.c_codigo;     
        let c_nombre = request.body.c_nombre;        
              
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_zona from pl_zona where n_idpl_zona =\'' + n_idpl_zona + '\')) then \n\r' +
            '           update pl_zona set c_codigo= \'' + c_codigo + '\', c_nombre=\''+c_nombre+'\', n_idpl_proyecto=' + n_idpl_proyecto +' where n_idpl_zona = \''+n_idpl_zona+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_zona(n_idpl_zona, c_codigo, c_nombre, n_idpl_proyecto, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_codigo + '\', \''+c_nombre+'\','+ n_idpl_proyecto +', 0, now(), 1); \n\r' +
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

const deleteZona= (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_zona set n_borrado= $1 where n_idpl_zona= $1',[request.body.n_idpl_zona],
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

const getProyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idpl_proyecto, c_nombre from pl_proyecto where n_borrado = 0 and (n_idpl_proyecto= $1 or 0 = $1) ',[request.body.n_idpl_proyecto],
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

const saveProyecto = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let n_idpl_proyecto = request.body.n_idpl_proyecto;            
        let c_nombre = request.body.c_nombre;       
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_proyecto from pl_proyecto where n_idpl_proyecto =\'' + n_idpl_proyecto + '\')) then \n\r' +
            '           update pl_proyecto set c_nombre= \'' + c_nombre + '\' where n_idpl_proyecto = \''+n_idpl_proyecto+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_proyecto(n_idpl_proyecto, c_nombre, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), 1); \n\r' +
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

const deleteProyecto= (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        pool.query('update pl_proyecto set n_borrado= $1 where n_idpl_proyecto= $1',[request.body.n_idpl_proyecto],
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

const getTipoFoto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        pool.query('select n_idgen_tipofoto, c_nombre, c_codigo, n_tipo from gen_tipofoto where n_borrado = 0',        
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

const saveTipoFoto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_tipofoto = request.body.n_idgen_tipofoto;
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;    
        let n_tipo = request.body.n_tipo;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_tipofoto from gen_tipofoto where n_idgen_tipofoto =\'' + n_idgen_tipofoto + '\')) then \n\r' +
            '           update gen_tipofoto set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_tipo=\'' + n_tipo + '\' where n_idgen_tipofoto = \''+ n_idgen_tipofoto +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipofoto(n_idgen_tipofoto, c_nombre,c_codigo, n_tipo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',\'' + n_tipo + '\', 0,now(), 1); \n\r' +
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

const deleteTipoFoto = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update gen_tipofoto set n_borrado= $1 where n_idgen_tipofoto= $1',[request.body.n_idgen_tipofoto],
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

const getEstructura= (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        pool.query('select e.n_idpl_estructura, e.n_idpl_zona, z.c_nombre, e.c_latitud, e.n_altitud, e.c_longitud from pl_estructura e \n\r' +
        '   left join pl_zona z on z.n_idpl_zona = e.n_idpl_zona \n\r' +            
        '   where e.n_borrado = 0 and (e.n_idpl_estructura = $1 or 0 = $1)',
        [request.body.n_idpl_estructura],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error2E!.", data: null })
                } else {                                      
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveEstructura = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_estructura = request.body.n_idpl_estructura;        
        let c_latitud = request.body.c_latitud;     
        let c_longitud = request.body.c_longitud;
        let n_altitud = request.body.n_altitud;
        let n_idpl_zona = request.body.n_idpl_zona;       
        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_estructura from pl_estructura where n_borrado = 0 and n_idpl_estructura =\'' + n_idpl_estructura + '\')) then \n\r' +
            '           update pl_estructura set c_latitud=\'' + c_latitud + '\', c_longitud=\'' + c_longitud + '\', n_altitud=' + n_altitud + ', n_idpl_zona=' + n_idpl_zona +' where n_idpl_estructura =\'' + n_idpl_estructura + '\'; \n\r' +
            '       else \n\r' +
            '           insert into pl_estructura(n_idpl_estructura, n_idpl_zona, c_latitud, c_longitud, n_altitud, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,' + n_idpl_zona + ', \'' + c_latitud + '\' ,\'' + c_longitud + '\' , ' + n_altitud + ', 0, now(), 1); \n\r' +
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

const deleteEstructura = (request,response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_estructura set n_borrado= $1 where n_idpl_estructura= $1',[request.body.n_idpl_estructura],
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

const getTipoEmpresa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        pool.query('select n_idgen_tipoempresa, c_nombre from gen_tipoempresa where n_borrado = 0',        
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

const saveTipoEmpresa = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let n_idgen_tipoempresa = request.body.n_idgen_tipoempresa;            
        let c_nombre = request.body.c_nombre;       
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_tipoempresa from gen_tipoempresa where n_idgen_tipoempresa =\'' + n_idgen_tipoempresa + '\')) then \n\r' +
            '           update gen_tipoempresa set c_nombre= \'' + c_nombre + '\' where n_idgen_tipoempresa = \''+n_idgen_tipoempresa+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipoempresa(n_idgen_tipoempresa, c_nombre, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), 1); \n\r' +
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

const deleteTipoEmpresa = (request,response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update gen_tipoempresa set n_borrado= $1 where n_idgen_tipoempresa= $1',
        [request.body.n_idgen_tipoempresa],
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
    getempresa,
    saveEmpresa,    
    deleteEmpresa,
    saveLinea,
    getLinea,
    deleteLinea,
    gettipolinea,
    saveTipoLinea,
    deleteTipoLinea,
    getZona,
    saveZona,
    deleteZona,
    getProyecto,
    saveProyecto,
    deleteProyecto,
    getTipoFoto,
    saveTipoFoto,
    deleteTipoFoto,
    getEstructura,
    saveEstructura,
    deleteEstructura,
    getTipoEmpresa,
    saveTipoEmpresa,
    deleteTipoEmpresa
}
