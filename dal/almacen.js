const jwt = require('jsonwebtoken');
const encriptar = require('../common/encriptar');
const cnx = require('../common/appsettings');
const valida = require('../common/validatoken');
const { request, response } = require('express');
let pool = cnx.pool;

const getAlmacen = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select al.n_idalm_almacen, al.n_idpro_proyecto, al.c_nombre, al.c_direccion from alm_almacen al \n\r' +
            'left join pro_proyecto pr on pr.n_idpro_proyecto = al.n_idpro_proyecto \n\r' +            
            'where al.n_borrado = 0 and (al.n_idpro_proyecto = $1 or 0 = $1)'
        pool.query(cadena,[request.body.n_idpro_proyecto],            
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


const saveAlmacen = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idalm_almacen = request.body.n_idalm_almacen;   
        let c_nombre = request.body.c_nombre;
        let c_direccion = request.body.c_direccion;                 
        let n_idpro_proyecto = request.body.n_idpro_proyecto;     
        let n_id_usermodi = request.body.n_id_usermodi;  
       
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idalm_almacen from alm_almacen where n_borrado = 0 and n_idalm_almacen =\'' + n_idalm_almacen + '\')) then \n\r' +
            '           update alm_almacen set c_nombre= \'' + c_nombre + '\', c_direccion=\'' + c_direccion + '\', n_idpro_proyecto=' + n_idpro_proyecto +', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idalm_almacen =\'' + n_idalm_almacen + '\'; \n\r' +
            '       else \n\r' +
            '           insert into alm_almacen(n_idalm_almacen,c_nombre,c_direccion,n_idpro_proyecto,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_direccion + '\',' + n_idpro_proyecto + ', 0, now(), '+n_id_usermodi+'); \n\r' +
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
const deleteAlmacen = (request,response) =>{
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idalm_almacen = request.body.n_idalm_almacen;
    if (obj.estado) {
        pool.query('update alm_almacen set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idalm_almacen='+n_idalm_almacen+' ',
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

const getGuia = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let cadena = 'select guia.n_idalm_guia, guia.n_idalm_almacen, pe.n_idgen_periodo, guia.c_nombre, guia.c_direccion, al.c_nombre as c_nombreal, pe.c_descripcion as periodo, split_part(pe.c_descripcion,\' \',1) as mes,pe.n_mes, split_part(pe.c_descripcion,\' \',2)::INT as annio,guia.c_ruc, guia.c_nroguia, guia.c_observacion from alm_guia guia \n\r' +
            'inner join alm_almacen al on al.n_idalm_almacen = guia.n_idalm_almacen \n\r' +   
            'inner join gen_periodo pe on pe.n_idgen_periodo = guia.n_idgen_periodo \n\r' +          
            'where guia.n_borrado = 0 and (al.n_idalm_almacen = $1 or 0 = $1) and (pe.n_idgen_periodo = $2 or 0 = $2) '+
            'order by annio asc, (CASE WHEN split_part(c_descripcion,\' \',1) = \'Enero\' THEN 1 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Febrero\' THEN 2 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Marzo\' THEN 3 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Abril\' THEN 4 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Mayo\' THEN 5 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Junio\' THEN 6 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Julio\' THEN 7 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Agosto\' THEN 8 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Setiembre\' THEN 9 '+
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Octubre\' THEN 10 '+    
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Noviembre\' THEN 11 '+   
                                    'WHEN split_part(c_descripcion,\' \',1)=\'Diciembre\' THEN 12 '+  
                                    'ELSE 0 END)';
        pool.query(cadena,[request.body.n_idalm_almacen,request.body.n_idgen_periodo],            
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

const saveGuia = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idalm_guia = request.body.n_idalm_guia; 
        let n_idalm_almacen = request.body.n_idalm_almacen;  
        let n_idgen_periodo = request.body.n_idgen_periodo; 
        let c_direccion = request.body.c_direccion; 
        let c_nombre = request.body.c_nombre;        
        let c_nroguia = request.body.c_nroguia;
        let c_ruc = request.body.c_ruc;
        let c_observacion = request.body.c_observacion;     
        let n_id_usermodi = request.body.n_id_usermodi;                          

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idalm_guia from alm_guia where n_borrado = 0 and n_idalm_guia =\'' + n_idalm_guia + '\')) then \n\r' +
            '           update alm_guia set c_nombre= \'' + c_nombre + '\', c_direccion=\'' + c_direccion + '\', n_idalm_almacen=' + n_idalm_almacen +',  \n\r' +
            '                  n_idgen_periodo=' + n_idgen_periodo +', c_nroguia=\'' + c_nroguia + '\', c_ruc=\'' + c_ruc + '\', c_observacion=\'' + c_observacion + '\', n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idalm_guia =\'' + n_idalm_guia + '\'; \n\r' +
            '       else \n\r' +
            '           insert into alm_guia(n_idalm_guia, c_nombre, c_direccion, n_idgen_periodo, n_idalm_almacen, c_nroguia, c_ruc, d_fecha, c_observacion, b_aprobar, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_direccion + '\',' + n_idgen_periodo + ',' + n_idalm_almacen + ', \'' + c_nroguia + '\', \'' + c_ruc + '\', now(),\'' + c_observacion + '\', '+ " false"+' ,0, now(), '+n_id_usermodi+'); \n\r' +
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
const deleteGuia = (request,response) =>{
    var obj = valida.validaToken(request)
    let n_idalm_guia = request.body.n_idalm_guia;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update alm_guia set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idalm_guia='+n_idalm_guia+' ',
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

const getAlmacenes = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select n_idalm_almacen, c_nombre from alm_almacen \n\r' +                       
            'where n_borrado = 0 and n_idalm_almacen = $1'
        pool.query(cadena,[request.body.n_idalm_almacen],         
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

const getPeriodos = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select  n_annio from gen_periodo where n_borrado = 0 group by n_annio';
        pool.query(cadena,         
            (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(200).json({ estado: false, mensaje: "DB: Error al traer Periodo 1!.", data: null })    
                } else {
                    let annio = results.rows;

                    let cadena2 = 'select n_mes from gen_periodo where n_borrado = 0 group by n_mes';
                    pool.query(cadena2,
                        (error, results)=>{
                            if(error){
                                console.log(error)
                                response.status(200).json({ estado: false, mensaje: "DB: Error al traer Periodo 2!.", data: null })    
                            }else{
                                let mes = results.rows;        

                                let cadena3 = 'select n_idgen_periodo, c_descripcion,n_mes,split_part(c_descripcion,\' \',1) as mes, split_part(c_descripcion,\' \',2)::INT as annio from gen_periodo  where n_borrado = 0 '+
                                                'order by annio asc, (CASE WHEN split_part(c_descripcion,\' \',1) = \'Enero\' THEN 1 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Febrero\' THEN 2 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Marzo\' THEN 3 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Abril\' THEN 4 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Mayo\' THEN 5 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Junio\' THEN 6 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Julio\' THEN 7 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Agosto\' THEN 8 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Setiembre\' THEN 9 '+
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Octubre\' THEN 10 '+    
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Noviembre\' THEN 11 '+   
                                                'WHEN split_part(c_descripcion,\' \',1)=\'Diciembre\' THEN 12 '+  
                                                'ELSE 0 END)'
                                                ;
                                pool.query(cadena3,
                                    (error,results)=>{
                                        if(error){
                                            console.log(error)
                                            response.status(200).json({ estado: false, mensaje: "DB: Error al traer Periodo 3!.", data: null })
                                        }else{
                                            let periodos = results.rows;
                                            response.status(200).json({ estado: true, mensaje: "", 
                                                data: {annio: annio, mes: mes, periodos: periodos} 
                                            })
                                        }
                                    })
                                
                            }
                    })
                    
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getGuias = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select n_idalm_guia, c_nombre from alm_guia \n\r' +                       
            'where n_borrado = 0'
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

const getElementos = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        
        let cadena = 'select n_idpl_elemento, c_nombre from pl_elemento \n\r' +                       
            'where n_borrado = 0 order by c_nombre asc'
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

const getDetalleGuia = (request, response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {        
        let cadena = 'select de.n_idalm_detalleguia, de.n_idalm_guia, de.n_idpl_elemento, el.c_nombre as c_nombreel, n_cantidad, de.c_ruta from alm_detalleguia de \n\r' +
            'inner join pl_elemento el on el.n_idpl_elemento = de.n_idpl_elemento \n\r' +   
            'inner join alm_guia guia on guia.n_idalm_guia = de.n_idalm_guia \n\r' +          
            'where de.n_borrado = 0 and (guia.n_idalm_guia = $1 or 0 = $1)'
        pool.query(cadena,[request.body.n_idalm_guia],            
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

const saveDetalleGuia = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let c_nombre = request.body.c_nombreImg;
        let c_ruta = request.body.c_ruta;
        let n_idalm_detalleguia = request.body.n_idalm_detalleguia; 
        let n_cantidad = request.body.n_cantidad;                                    
        let n_idalm_guia = request.body.n_idalm_guia;
        let n_idpl_elemento = request.body.n_idpl_elemento;
        let n_id_usermodi = request.body.n_id_usermodi;

        console.log("nombre",c_nombre)
        console.log("ruta",c_ruta)
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idalm_detalleguia from alm_detalleguia where n_borrado = 0 and n_idalm_detalleguia =\'' + n_idalm_detalleguia + '\')) then \n\r' +
            '           update alm_detalleguia set n_cantidad= \'' + n_cantidad + '\', n_idpl_elemento=\' '+ n_idpl_elemento +'\', c_ruta=\''+ c_ruta +'\', c_nombre=\''+ c_nombre +'\' , n_id_usermodi='+n_id_usermodi+', d_fechamodi= now()  \n\r' +
            '                  where n_idalm_detalleguia =\'' + n_idalm_detalleguia + '\'; \n\r' +
            '       else \n\r' +
            '           insert into alm_detalleguia(n_idalm_detalleguia, n_cantidad, n_idalm_guia,n_idpl_elemento, c_ruta, c_nombre, n_borrado, d_fechacrea, n_id_usercrea)\n\r' +
            '           values (default,\'' + n_cantidad + '\',\'' + n_idalm_guia + '\','+ n_idpl_elemento +', \''+ c_ruta+'\',\''+ c_nombre +'\',0, now(), '+n_id_usermodi+');\n\r' +
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

const saveImgDetalleGuia  = (request,response)=>{
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idalm_detalleguia = request.body.n_idalm_detalleguia; 
        let n_cantidad = request.body.n_cantidad;                                    
        let n_idalm_guia = request.body.n_idalm_guia;
        let n_idpl_elemento = request.body.n_idpl_elemento;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idalm_detalleguia from alm_detalleguia where n_borrado = 0 and n_idalm_detalleguia =\'' + n_idalm_detalleguia + '\')) then \n\r' +
            '           update alm_detalleguia set n_cantidad= \'' + n_cantidad + '\', n_idpl_elemento=\' '+ n_idpl_elemento +' \'  \n\r' +
            '                  where n_idalm_detalleguia =\'' + n_idalm_detalleguia + '\'; \n\r' +
            '       else \n\r' +
            '           insert into alm_detalleguia(n_idalm_detalleguia, n_cantidad, n_idalm_guia,n_idpl_elemento, n_borrado, d_fechacrea, n_id_usercrea)\n\r' +
            '           values (default,\'' + n_cantidad + '\',\'' + n_idalm_guia + '\','+ n_idpl_elemento +',0, now(), 1);\n\r' +
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

const deleteDetalleGuia = (request,response) =>{
    var obj = valida.validaToken(request)
    
    let n_idalm_detalleguia = request.body.n_idalm_detalleguia;
    let n_id_usermodi = request.body.n_id_usermodi;

    if (obj.estado) {
        pool.query('update alm_detalleguia set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idalm_detalleguia='+n_idalm_detalleguia+' ',
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

const savePeriodo = (request,response)=>{
    var obj = valida.validaToken(request)
    
    if (obj.estado) {

        let annio = request.body.annio; 
        let c_descripcion = request.body.c_descripcion;                                    
        //let mes = request.body.mes;
        let n_id_usermodi = request.body.n_id_usermodi;
        let n_idgen_periodo = request.body.n_idgen_periodo;
        let n_mes = request.body.n_mes;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_periodo from gen_periodo where n_borrado = 0 and n_idgen_periodo =\'' + n_idgen_periodo + '\')) then \n\r' +
            '           update gen_periodo set n_annio ='+ annio +', n_mes=\' '+ n_mes +' \', c_descripcion=\''+c_descripcion+'\',n_id_usermodi='+ n_id_usermodi +', d_fechamodi=now() \n\r' +
            '                  where n_idgen_periodo =\'' + n_idgen_periodo + '\'; \n\r' +
            '       else \n\r' +
            '           insert into gen_periodo(n_idgen_periodo, n_annio, n_mes,c_descripcion, n_borrado, n_id_usercrea, d_fechacrea)\n\r' +
            '           values (default,' + annio + ',' + n_mes + ',\''+ c_descripcion +'\',0, '+n_id_usermodi+',now());\n\r' +
            '       end if; \n\r' +
            '   end \n\r' +
            '$$';

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al guardar Periodo!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deletePeriodo = (request,response) =>{
    var obj = valida.validaToken(request)
    
    let n_idgen_periodo = request.body.n_idgen_periodo;
    let n_id_usermodi = request.body.n_id_usermodi;

    if (obj.estado) {
        pool.query('update gen_periodo set n_borrado= 1, n_id_usermodi='+n_id_usermodi+', d_fechamodi= now() where n_idgen_periodo='+n_idgen_periodo+' ',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error al Eliminar!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

module.exports = {
    getAlmacen,
    getAlmacenes,
    saveAlmacen,    
    deleteAlmacen,
    getGuia,
    saveGuia,    
    deleteGuia,
    getPeriodos,    
    getGuias,
    getElementos,
    getDetalleGuia,
    saveDetalleGuia,
    deleteDetalleGuia,
    saveImgDetalleGuia,
    savePeriodo,
    deletePeriodo
}
