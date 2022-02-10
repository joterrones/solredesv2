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
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_empresa from gen_empresa where n_idgen_empresa =\'' + n_idgen_empresa + '\')) then \n\r' +
            '           update gen_empresa set c_nombrecorto= \'' + c_nombrecorto + '\', c_ruc=\'' + c_ruc + '\', c_razonsocial=\'' + c_razonsocial + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_empresa = \''+ n_idgen_empresa +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_empresa(n_idgen_empresa, c_nombrecorto,c_ruc, c_razonsocial, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombrecorto + '\',\'' + c_ruc + '\',\'' + c_razonsocial + '\', 0,now(),'+n_id_usermodi+'); \n\r' +
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
    
    let n_id_usermodi = request.body.n_id_usermodi;    
    let n_idgen_empresa = request.body.n_idgen_empresa;

    if (obj.estado) {
        pool.query('update gen_empresa set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_empresa='+n_idgen_empresa+' ',
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
        console.log(request.body.n_idpl_zona);
        let cadena = 'Select l.n_idpl_linea, l.c_nombre, l.c_codigo, l.n_idpl_tipolinea, l.n_idpl_zona,tp.c_nombre as c_nombret, zn.c_nombre as c_nombrez from pl_linea as l \n\r' +
            'left join pl_tipolinea tp on tp.n_idpl_tipolinea = l.n_idpl_tipolinea \n\r' +    
            'left join pl_zona zn on zn.n_idpl_zona = l.n_idpl_zona \n\r' +         
            'inner join pro_proyecto pro on pro.n_idpro_proyecto = zn.n_idpro_proyecto \n\r' +
            'where l.n_borrado = 0 and (l.n_idpl_tipolinea = $1 or 0 = $1) and (l.n_idpl_zona = $2 or 0 = $2) and (zn.n_idpro_proyecto = $3 or 0 = $3)'
        pool.query(cadena,
            [request.body.n_idpl_tipolinea, request.body.n_idpl_zona,request.body.n_idpro_proyecto],
            (error, results) => {
                if (error) {
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

const saveLinea = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_linea = request.body.n_idpl_linea;   
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;     
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;   
        let n_idpl_zona = request.body.n_idpl_zona; 
        let n_id_usermodi = request.body.n_id_usermodi;   
        console.log(n_idpl_zona);
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_linea from pl_linea where n_borrado = 0 and n_idpl_linea =\'' + n_idpl_linea + '\')) then \n\r' +
            '           update pl_linea set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_idpl_tipolinea=' + n_idpl_tipolinea +', n_idpl_zona=\''+ n_idpl_zona +'\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_linea =\'' + n_idpl_linea + '\'; \n\r' +
            '       else \n\r' +
            '           insert into pl_linea(n_idpl_linea,c_nombre,c_codigo,n_idpl_tipolinea,n_idpl_zona,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',' + n_idpl_tipolinea + ', \''+ n_idpl_zona +'\',0, now(), '+n_id_usermodi+'); \n\r' +
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
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idpl_linea = request.body.n_idpl_linea;
    if (obj.estado) {
        pool.query('update pl_linea set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_linea='+n_idpl_linea+' ',
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
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_tipolinea from pl_tipolinea where n_idpl_tipolinea =\'' + n_idpl_tipolinea + '\')) then \n\r' +
            '           update pl_tipolinea set c_nombre= \'' + c_nombre + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_tipolinea = \''+n_idpl_tipolinea+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_tipolinea(n_idpl_tipolinea,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), '+n_id_usermodi+'); \n\r' +
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
        let n_id_usermodi = request.body.n_id_usermodi;
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
        pool.query('update pl_tipolinea set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_tipolinea='+n_idpl_tipolinea+' ',
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
        pool.query('Select z.n_idpl_zona, z.n_idpro_proyecto, z.c_codigo, z.c_nombre, pr.c_nombre as c_nombrep from pl_zona z \n\r' +
        'left join pro_proyecto pr on pr.n_idpro_proyecto = z.n_idpro_proyecto \n\r' +            
        'where z.n_borrado = 0 and (z.n_idpl_zona = $1 or 0 = $1) and pr.n_idpro_proyecto = $2'
        ,[request.body.n_idpl_zona, request.body.n_idpro_proyecto],
            (error, results) => {
                
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error222!.", data: null })
                } else {                    
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getZonas = (request, response) => {    
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('Select n_idpl_zona, c_codigo, c_nombre, n_idpro_proyecto from pl_zona \n\r' +       
        'where n_borrado = 0 and (n_idpl_zona = $1 or 0 = $1) and (n_idpro_proyecto = $2 or 0 = $2)'
        ,[request.body.n_idpl_tipolinea,request.body.n_idpro_proyecto],
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
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let c_codigo = request.body.c_codigo;     
        let c_nombre = request.body.c_nombre;  
        let n_id_usermodi = request.body.n_id_usermodi;      
              
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_zona from pl_zona where n_idpl_zona =\'' + n_idpl_zona + '\')) then \n\r' +
            '           update pl_zona set c_codigo= \'' + c_codigo + '\', c_nombre=\''+c_nombre+'\', n_idpro_proyecto=' + n_idpro_proyecto +', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_zona = \''+n_idpl_zona+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_zona(n_idpl_zona, c_codigo, c_nombre, n_idpro_proyecto, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_codigo + '\', \''+c_nombre+'\','+ n_idpro_proyecto +', 0, now(), '+n_id_usermodi+'); \n\r' +
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
        let n_idpl_zona = request.body.n_idpl_zona;
        let n_id_usermodi = request.body.n_id_usermodi;

        pool.query('update pl_zona set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_zona='+n_idpl_zona+' ',
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
        pool.query('Select n_idpro_proyecto, c_nombre, c_detalle, c_color, c_rutalogo, c_rutaimg from pro_proyecto where n_borrado = 0 and (n_idpro_proyecto= $1 or 0 = $1) ',[request.body.n_idpro_proyecto],
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
        let n_idpro_proyecto = request.body.n_idpro_proyecto;            
        let c_nombre = request.body.c_nombre;    
        let c_detalle = request.body.c_detalle;           
        let n_id_usermodi = request.body.n_id_usermodi;
        console.log(c_detalle);
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpro_proyecto from pro_proyecto where n_idpro_proyecto =\'' + n_idpro_proyecto + '\')) then \n\r' +
            '           update pro_proyecto set c_nombre= \'' + c_nombre + '\', c_detalle= \'' + c_detalle + '\', n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpro_proyecto = \''+n_idpro_proyecto+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pro_proyecto(n_idpro_proyecto, c_nombre, c_detalle, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', \'' + c_detalle + '\',0, now(), '+n_id_usermodi+'); \n\r' +
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
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let n_id_usermodi = request.body.n_id_usermodi;
        
        pool.query('update pro_proyecto set n_borrado= 1, n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpro_proyecto= '+n_idpro_proyecto+' ',
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
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_tipofoto from gen_tipofoto where n_idgen_tipofoto =\'' + n_idgen_tipofoto + '\')) then \n\r' +
            '           update gen_tipofoto set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_tipo=\'' + n_tipo + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_tipofoto = \''+ n_idgen_tipofoto +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipofoto(n_idgen_tipofoto, c_nombre,c_codigo, n_tipo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',\'' + n_tipo + '\', 0,now(), '+n_id_usermodi+'); \n\r' +
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
    
    let n_idgen_tipofoto = request.body.n_idgen_tipofoto;
    let n_id_usermodi = request.body.n_id_usermodi;

    if (obj.estado) {
        pool.query('update gen_tipofoto set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_tipofoto='+n_idgen_tipofoto+' ',
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
        let n_id_usermodi = request.body.n_id_usermodi;  
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_tipoempresa from gen_tipoempresa where n_idgen_tipoempresa =\'' + n_idgen_tipoempresa + '\')) then \n\r' +
            '           update gen_tipoempresa set c_nombre= \'' + c_nombre + '\', n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_tipoempresa = \''+n_idgen_tipoempresa+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipoempresa(n_idgen_tipoempresa, c_nombre, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), '+n_id_usermodi+'); \n\r' +
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
    let n_idgen_tipoempresa = request.body.n_idgen_tipoempresa;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update gen_tipoempresa set n_borrado=1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_tipoempresa='+n_idgen_tipoempresa+' ',
        
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

const getValoresGnr = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_valoresgenerales, c_codigo, c_nombre from gen_valoresgenerales where n_borrado = 0',
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

const saveValoresGnr = (request, response) =>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_valoresgenerales = request.body.n_idgen_valoresgenerales;
        let c_codigo = request.body.c_codigo;   
        let c_nombre = request.body.c_nombre; 
        let n_id_usermodi = request.body.n_id_usermodi;     
 
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_valoresgenerales from gen_valoresgenerales where n_idgen_valoresgenerales =\'' + n_idgen_valoresgenerales + '\')) then \n\r' +
            '           update gen_valoresgenerales set c_codigo=\''+ c_codigo +'\', c_nombre= \'' + c_nombre + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_valoresgenerales = \''+n_idgen_valoresgenerales+'\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_valoresgenerales(n_idgen_valoresgenerales, c_codigo, c_nombre, n_valorunico, n_tipo, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_codigo + '\',\'' + c_nombre + '\', 0, 1, 0, now(), '+n_id_usermodi+'); \n\r' +
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

const deleteValorGnr = (request, response) =>{
    var obj = valida.validaToken(request)
    let n_idgen_valoresgenerales = request.body.n_idgen_valoresgenerales;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update gen_valoresgenerales set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_valoresgenerales='+n_idgen_valoresgenerales+' ',
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

const getTraGrupos = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select gr.n_idtra_grupo, gr.n_idpro_proyecto, gr.c_nombre from tra_grupo gr \n\r' +
            'inner join pro_proyecto pro on pro.n_idpro_proyecto = gr.n_idpro_proyecto  \n\r' +        
            'where gr.n_borrado = 0 and (gr.n_idpro_proyecto = $1 or 0 = $1)'
        pool.query(cadena,
            [request.body.n_idpro_proyecto],
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

const savetraGrupos = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idtra_grupo = request.body.n_idtra_grupo
        let n_idpro_proyecto = request.body.n_idpro_proyecto;   
        let c_nombre = request.body.c_nombre;  
        let n_id_usermodi = request.body.n_id_usermodi;
        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idtra_grupo from tra_grupo where n_borrado = 0 and n_idtra_grupo =\'' + n_idtra_grupo + '\')) then \n\r' +
            '           update tra_grupo set c_nombre= \'' + c_nombre + '\', n_idpro_proyecto=' + n_idpro_proyecto +', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idtra_grupo =\'' + n_idtra_grupo + '\'; \n\r' +
            '       else \n\r' +
            '           insert into tra_grupo(n_idtra_grupo, c_nombre, n_idpro_proyecto, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',' + n_idpro_proyecto + ',0, now(), '+n_id_usermodi+'); \n\r' +
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

const deletetraGrupos = (request,response) =>{
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    if (obj.estado) {
        pool.query('update tra_grupo set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idtra_grupo='+n_idtra_grupo+' ',
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

const getProUser = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select us.n_idseg_userprofile as n_idseg_userprofileusu, us.c_username, gru.n_idtra_grupo, gru.n_idseg_userprofile, gru.b_activo from seg_userprofile us \n\r' +
            'left join tra_grupousuario gru on gru.n_idseg_userprofile = us.n_idseg_userprofile and  gru.n_idtra_grupo = $1 or (gru.n_idseg_userprofile = null)   \n\r' +        
            'inner join pro_usuarioproyecto pro on pro.n_idseg_userprofile = us.n_idseg_userprofile and pro.n_idpro_proyecto = $2   \n\r' +        
            'where us.n_borrado = 0'
        pool.query(cadena,
            [request.body.n_idtra_grupo,request.body.n_idpro_proyecto],
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

const resetProUser = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let cadena = 'update tra_grupousuario set b_activo = false \n\r' +     
            'where n_idtra_grupo = $1'  
        pool.query(cadena,[request.body.n_idtra_grupo],
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

const saveProUser = (request, response)=>{
    
    var obj = valida.validaToken(request)
    console.log(request.body.n_idseg_userprofile);
    console.log(request.body.n_idtra_grupo);
    let n_idseg_userprofile = request.body.n_idseg_userprofile;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    if (obj.estado) {        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idtra_grupo, n_idseg_userprofile from tra_grupousuario where n_idtra_grupo = '+ n_idtra_grupo +' and n_idseg_userprofile = '+ n_idseg_userprofile +')) then \n\r' +
            '           update tra_grupousuario set b_activo = true	where n_idseg_userprofile = '+ n_idseg_userprofile +' and n_idtra_grupo = '+ n_idtra_grupo +'; \n\r' +
            '       else \n\r' +
            '           INSERT INTO tra_grupousuario(n_idtra_grupousuario, n_idtra_grupo, n_idseg_userprofile, b_activo, n_borrado, n_id_usercrea, n_is_usermodi, d_fechacrea, d_fechamodi) \n\r' +
            '           VALUES (default, '+ n_idtra_grupo +', '+ n_idseg_userprofile +', true, 0, 1, 1, now(), now()); \n\r' +
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

const getLineaUser = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select al.n_idpl_linea as n_idpl_linealn, al.c_nombre, gru.n_idtra_grupo, gru.n_idpl_linea, gru.n_borrado from pl_linea al \n\r' +
            'inner join pl_zona zn on zn.n_idpl_zona = al.n_idpl_zona \n\r' +
            'inner join pro_proyecto pro on pro.n_idpro_proyecto = zn.n_idpro_proyecto \n\r' +
            'inner join pl_tipolinea tp on tp.n_idpl_tipolinea = al.n_idpl_tipolinea \n\r' +
            'left join tra_grupolinea gru on gru.n_idpl_linea = al.n_idpl_linea and  gru.n_idtra_grupo = $1 or (gru.n_idpl_linea = null) \n\r' +        
            'where al.n_borrado = 0 and (al.n_idpl_zona = $2 or 0 = $2) and (al.n_idpl_tipolinea = $3 or 0 = $3) and (zn.n_idpro_proyecto = $4) '
        pool.query(cadena,
            [request.body.n_idtra_grupo, request.body.n_idpl_zona, request.body.n_idpl_tipolinea, request.body.n_idpro_proyecto],
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

const noAsignarLineaUser = (request, response) => {
    //QUITAR ASIGANCIÓN
    var obj = valida.validaToken(request)
    console.log(request.body.n_idpl_linea);
    console.log(request.body.n_idtra_grupo);
    let n_idpl_linea = request.body.n_idpl_linea;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    if (obj.estado) {        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idtra_grupo, n_idpl_linea from tra_grupolinea where n_idpl_linea ='+ n_idpl_linea +' and n_idtra_grupo = '+ n_idtra_grupo +')) then \n\r' +
            '           update tra_grupolinea set n_borrado = 1	where n_idpl_linea ='+ n_idpl_linea +' and n_idtra_grupo = '+ n_idtra_grupo +'; \n\r' +
            '       else \n\r' +
            '           INSERT INTO tra_grupolinea(n_idtra_grupolinea, n_idpl_linea, n_idtra_grupo, n_borrado, n_id_usercrea, n_is_usermodi, d_fechacrea, d_fechamodi) \n\r' +
            '           VALUES (default, '+ n_idpl_linea +', '+ n_idtra_grupo +', 0, 1, 1, now(), now()); \n\r' +
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

const asignarLineaUser = (request, response)=>{
    //ASIGNAR
    var obj = valida.validaToken(request)
    console.log(request.body.n_idpl_linea);
    console.log(request.body.n_idtra_grupo);
    let n_idpl_linea = request.body.n_idpl_linea;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    if (obj.estado) {        
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idtra_grupo, n_idpl_linea from tra_grupolinea where n_idpl_linea ='+ n_idpl_linea +' and n_idtra_grupo = '+ n_idtra_grupo +')) then \n\r' +
            '           update tra_grupolinea set n_borrado = 0	where n_idpl_linea ='+ n_idpl_linea +' and n_idtra_grupo = '+ n_idtra_grupo +'; \n\r' +
            '       else \n\r' +
            '           INSERT INTO tra_grupolinea(n_idtra_grupolinea, n_idpl_linea, n_idtra_grupo, n_borrado, n_id_usercrea, n_is_usermodi, d_fechacrea, d_fechamodi) \n\r' +
            '           VALUES (default, '+ n_idpl_linea +', '+ n_idtra_grupo +', 0, 1, 1, now(), now()); \n\r' +
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

const getTipoElemento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        pool.query('select n_idpl_tipoelemento, c_nombre, c_codigo, split_part(c_codigo,\'_\',1) as div, split_part(c_codigo,\'_\',2)::DECIMAL as div2 from pl_tipoelemento  '+ 
                    'where n_borrado = 0 order by div asc, div2 asc',        
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

const saveTipoElemento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_tipoelemento = request.body.n_idpl_tipoelemento;
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;
        let n_id_usermodi = request.body.n_id_usermodi;   

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_tipoelemento from pl_tipoelemento where n_idpl_tipoelemento = \'' + n_idpl_tipoelemento + '\')) then \n\r' +
            '           update pl_tipoelemento set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_tipoelemento = \''+ n_idpl_tipoelemento +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_tipoelemento(n_idpl_tipoelemento, c_nombre,c_codigo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\', 0,now(), '+n_id_usermodi+'); \n\r' +
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

const deleteTipoElemento = (request, response) =>{
    var obj = valida.validaToken(request)
    let n_idpl_tipoelemento = request.body.n_idpl_tipoelemento;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update pl_tipoelemento set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpl_tipoelemento='+n_idpl_tipoelemento+' ',
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

const getTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        pool.query('select n_idmon_categoriatipomontaje, c_nombre, c_codigo, split_part(c_codigo,\'_\',1) as div, split_part(c_codigo,\'_\',2)::DECIMAL as div2 from mon_categoriatipomontaje '+
                ' where n_borrado = 0	order by div asc, div2 asc',        
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

const saveTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idmon_categoriatipomontaje = request.body.n_idmon_categoriatipomontaje;
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;   
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idmon_categoriatipomontaje from mon_categoriatipomontaje where n_idmon_categoriatipomontaje = \'' + n_idmon_categoriatipomontaje + '\')) then \n\r' +
            '           update mon_categoriatipomontaje set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idmon_categoriatipomontaje = \''+ n_idmon_categoriatipomontaje +'\' ; \n\r' +
            '       else \n\r' +
            '           insert into mon_categoriatipomontaje(n_idmon_categoriatipomontaje, c_nombre,c_codigo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\', 0,now(), '+n_id_usermodi+'); \n\r' +
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

const deleteTipoMontaje = (request, response) =>{
    var obj = valida.validaToken(request)
    let n_idmon_categoriatipomontaje = request.body.n_idmon_categoriatipomontaje;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update mon_categoriatipomontaje set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idmon_categoriatipomontaje='+n_idmon_categoriatipomontaje+' ',
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

const saveProImg = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_proyecto = request.body.n_idpro_proyecto
        let c_rutaimg = request.body.c_rutaimg;   
        let cadena = 'update pro_proyecto set c_rutaimg= \'' + c_rutaimg + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpro_proyecto = \''+ n_idpro_proyecto +'\' ';
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

const saveProImgLogo = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_proyecto = request.body.n_idpro_proyecto
        let c_rutalogo = request.body.c_rutalogo;   
        let n_id_usermodi = request.body.n_id_usermodi;   
        console.log(request.body.c_rutalogo);
        let cadena = 'update pro_proyecto set c_rutalogo= \'' + c_rutalogo + '\', n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpro_proyecto = \''+ n_idpro_proyecto +'\' ';
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

const saveColorPro = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let c_color = request.body.c_color;   
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'update pro_proyecto set c_color= \'' + c_color + '\', n_is_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idpro_proyecto = \''+ n_idpro_proyecto +'\' ';
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
    getZonas,
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
    deleteTipoEmpresa,
    getValoresGnr,
    saveValoresGnr,
    deleteValorGnr,
    getTraGrupos,
    savetraGrupos,
    deletetraGrupos,
    getProUser,
    resetProUser,
    saveProUser,
    getLineaUser,
    noAsignarLineaUser,
    asignarLineaUser,
    getTipoElemento,
    saveTipoElemento,
    deleteTipoElemento,
    getTipoMontaje,
    saveTipoMontaje,
    deleteTipoMontaje,
    saveProImg,
    saveProImgLogo,
    saveColorPro
}
