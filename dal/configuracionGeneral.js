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
            '           update gen_empresa set c_nombrecorto= \'' + c_nombrecorto + '\', c_ruc=\'' + c_ruc + '\', c_razonsocial=\'' + c_razonsocial + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_empresa = \'' + n_idgen_empresa + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_empresa(n_idgen_empresa, c_nombrecorto,c_ruc, c_razonsocial, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombrecorto + '\',\'' + c_ruc + '\',\'' + c_razonsocial + '\', 0,now(),' + n_id_usermodi + '); \n\r' +
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

const deleteEmpresa = (request, response) => {
    var obj = valida.validaToken(request)

    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idgen_empresa = request.body.n_idgen_empresa;

    if (obj.estado) {
        pool.query('update gen_empresa set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_empresa=' + n_idgen_empresa + ' ',
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

const getLinea = (request, response) => {
    console.log("getLinea");
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let expedienteAux = '';
        let replanteoAux = '';
        let montajeAux = '';
        let cierreAux = '';
        
        let estadoSelectb_expediente = request.body.estadoSelectb_expediente;
        let estadoSelectb_replanteo = request.body.estadoSelectb_replanteo;
        let estadoSelectb_montaje = request.body.estadoSelectb_montaje;
        let estadoSelectb_cierre = request.body.estadoSelectb_cierre;

        if(estadoSelectb_expediente == null){ estadoSelectb_expediente = 'null'; }
        if(estadoSelectb_replanteo == null){ estadoSelectb_replanteo = 'null'; }
        if(estadoSelectb_montaje == null){ estadoSelectb_montaje = 'null'; }
        if(estadoSelectb_cierre == null){ estadoSelectb_cierre = 'null'; }

        if(estadoSelectb_expediente == false){ expedienteAux = ' or l.b_expediente is null '; }
        if(estadoSelectb_replanteo == false){ replanteoAux = ' or l.b_replanteo is null '; }
        if(estadoSelectb_montaje == false){ montajeAux = ' or l.b_montaje is null '; }
        if(estadoSelectb_cierre == false){ cierreAux = ' or l.b_cierre is null '; }

        let cadena = 'Select l.n_idpl_linea, l.c_nombre, l.c_codigo, l.n_idpl_tipolinea, l.n_idpl_zona,tp.c_nombre as c_nombret, zn.c_nombre as c_nombrez, l.b_expediente, l.b_replanteo, l.b_montaje,l.b_cierre from pl_linea as l  \n\r' +
            'left join pl_tipolinea tp on tp.n_idpl_tipolinea = l.n_idpl_tipolinea \n\r' +
            'left join pl_zona zn on zn.n_idpl_zona = l.n_idpl_zona and zn.n_borrado = 0\n\r' +
            'inner join pro_proyecto pro on pro.n_idpro_proyecto = zn.n_idpro_proyecto \n\r' +
            'where l.n_borrado = 0 and (l.n_idpl_tipolinea = $1 or 0 = $1) and (l.n_idpl_zona = $2 or 0 = $2) and (zn.n_idpro_proyecto = $3 or 0 = $3) \n\r' +
            'and ( l.b_expediente is '+estadoSelectb_expediente+' or null is '+estadoSelectb_expediente+' '+expedienteAux+') \n\r' +
            'and ( l.b_replanteo is '+estadoSelectb_replanteo+' or null is '+estadoSelectb_replanteo+' '+replanteoAux+') \n\r' +
            'and (l.b_montaje is '+estadoSelectb_montaje+' or null is '+estadoSelectb_montaje+' '+montajeAux+')  \n\r' +
            'and (l.b_cierre is '+estadoSelectb_cierre+' or null is '+estadoSelectb_cierre+' '+cierreAux+') \n\r' +
            'ORDER BY c_nombrez asc,l.c_codigo asc, c_nombret asc, l.d_fechamodi asc ';
        pool.query(cadena,
            [request.body.n_idpl_tipolinea, request.body.n_idpl_zona, request.body.n_idpro_proyecto],
            (error, results) => {
                if (error) {
                    console.log(cadena);
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

const saveLinea = (request, response) => {
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
            '           update pl_linea set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_idpl_tipolinea=' + n_idpl_tipolinea + ', n_idpl_zona=\'' + n_idpl_zona + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_linea =\'' + n_idpl_linea + '\'; \n\r' +
            '       else \n\r' +
            '           insert into pl_linea(n_idpl_linea,c_nombre,c_codigo,n_idpl_tipolinea,n_idpl_zona,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',' + n_idpl_tipolinea + ', \'' + n_idpl_zona + '\',0, now(), ' + n_id_usermodi + '); \n\r' +
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
const deleteLinea = (request, response) => {
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idpl_linea = request.body.n_idpl_linea;
    if (obj.estado) {
        pool.query('update pl_linea set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_linea=' + n_idpl_linea + ' ',
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

const estadoLinea = (request, response) => {
    var obj = valida.validaToken(request)
    let estado = request.body.estado;
    let id = request.body.id;
    let n_id_usermodi = request.body.n_id_usermodi;
    let colum = "";
    let n_idpl_linea =  request.body.n_idpl_linea;

    switch (id) {
        case 1:
            colum = "b_expediente"
            break;
        case 2:
            colum = "b_replanteo"
            break;
        case 3:
            colum = "b_montaje"
            break;
        case 4:
            colum = "b_cierre"
            break;

        default:
            break;
    }

    if (obj.estado) {
        pool.query('update pl_linea set '+colum+' = '+estado+', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_linea=' + n_idpl_linea + ' ',
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error ESTADO!.", data: null })
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
        pool.query('Select n_idpl_tipolinea, c_nombre from pl_tipolinea where n_borrado = 0 and (n_idpl_tipolinea= $1 or 0 = $1) ', 
        [request.body.n_idpl_tipolinea],
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

const saveTipoLinea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
        let c_nombre = request.body.c_nombre;
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idpl_tipolinea from pl_tipolinea where n_idpl_tipolinea =\'' + n_idpl_tipolinea + '\')) then \n\r' +
            '           update pl_tipolinea set c_nombre= \'' + c_nombre + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_tipolinea = \'' + n_idpl_tipolinea + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_tipolinea(n_idpl_tipolinea,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteTipoLinea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_id_usermodi = request.body.n_id_usermodi;
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
        pool.query('update pl_tipolinea set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_tipolinea=' + n_idpl_tipolinea + ' ',
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
            , [request.body.n_idpl_zona, request.body.n_idpro_proyecto],
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
            'where n_borrado = 0  and (n_idpro_proyecto = $1 or 0 = $1)'
            , [request.body.n_idpro_proyecto],
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

const saveZona = (request, response) => {
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
            '           update pl_zona set c_codigo= \'' + c_codigo + '\', c_nombre=\'' + c_nombre + '\', n_idpro_proyecto=' + n_idpro_proyecto + ', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_zona = \'' + n_idpl_zona + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_zona(n_idpl_zona, c_codigo, c_nombre, n_idpro_proyecto, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_codigo + '\', \'' + c_nombre + '\',' + n_idpro_proyecto + ', 0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteZona = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpl_zona = request.body.n_idpl_zona;
        let n_id_usermodi = request.body.n_id_usermodi;

        pool.query('update pl_zona set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_zona=' + n_idpl_zona + ' ',
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
        pool.query('Select n_idpro_proyecto, c_nombre, c_detalle, c_color, c_rutalogo, c_rutaimg from pro_proyecto where n_borrado = 0 and (n_idpro_proyecto= $1 or 0 = $1) ', [request.body.n_idpro_proyecto],
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

const saveProyecto = (request, response) => {
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
            '           update pro_proyecto set c_nombre= \'' + c_nombre + '\', c_detalle= \'' + c_detalle + '\', n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpro_proyecto = \'' + n_idpro_proyecto + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into pro_proyecto(n_idpro_proyecto, c_nombre, c_detalle, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', \'' + c_detalle + '\',0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteProyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let n_id_usermodi = request.body.n_id_usermodi;

        pool.query('update pro_proyecto set n_borrado= 1, n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpro_proyecto= ' + n_idpro_proyecto + ' ',
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
            '           update gen_tipofoto set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_tipo=\'' + n_tipo + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_tipofoto = \'' + n_idgen_tipofoto + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipofoto(n_idgen_tipofoto, c_nombre,c_codigo, n_tipo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\',\'' + n_tipo + '\', 0,now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteTipoFoto = (request, response) => {

    var obj = valida.validaToken(request)

    let n_idgen_tipofoto = request.body.n_idgen_tipofoto;
    let n_id_usermodi = request.body.n_id_usermodi;

    if (obj.estado) {
        pool.query('update gen_tipofoto set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_tipofoto=' + n_idgen_tipofoto + ' ',
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

const getEstructura = (request, response) => {
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

const saveEstructura = (request, response) => {
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
            '           update pl_estructura set c_latitud=\'' + c_latitud + '\', c_longitud=\'' + c_longitud + '\', n_altitud=' + n_altitud + ', n_idpl_zona=' + n_idpl_zona + ' where n_idpl_estructura =\'' + n_idpl_estructura + '\'; \n\r' +
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

const deleteEstructura = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('update pl_estructura set n_borrado= $1 where n_idpl_estructura= $1', [request.body.n_idpl_estructura],
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

const saveTipoEmpresa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_tipoempresa = request.body.n_idgen_tipoempresa;
        let c_nombre = request.body.c_nombre;
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_tipoempresa from gen_tipoempresa where n_idgen_tipoempresa =\'' + n_idgen_tipoempresa + '\')) then \n\r' +
            '           update gen_tipoempresa set c_nombre= \'' + c_nombre + '\', n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_tipoempresa = \'' + n_idgen_tipoempresa + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_tipoempresa(n_idgen_tipoempresa, c_nombre, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\', 0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteTipoEmpresa = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idgen_tipoempresa = request.body.n_idgen_tipoempresa;
    let n_id_usermodi = request.body.n_id_usermodi;
    console.log(n_id_usermodi);
    if (obj.estado) {
        pool.query('update gen_tipoempresa set n_borrado=1, n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_tipoempresa=' + n_idgen_tipoempresa,

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

const saveValoresGnr = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_valoresgenerales = request.body.n_idgen_valoresgenerales;
        let c_codigo = request.body.c_codigo;
        let c_nombre = request.body.c_nombre;
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idgen_valoresgenerales from gen_valoresgenerales where n_idgen_valoresgenerales =\'' + n_idgen_valoresgenerales + '\')) then \n\r' +
            '           update gen_valoresgenerales set c_codigo=\'' + c_codigo + '\', c_nombre= \'' + c_nombre + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_valoresgenerales = \'' + n_idgen_valoresgenerales + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into gen_valoresgenerales(n_idgen_valoresgenerales, c_codigo, c_nombre, n_valorunico, n_tipo, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_codigo + '\',\'' + c_nombre + '\', 0, 1, 0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteValorGnr = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idgen_valoresgenerales = request.body.n_idgen_valoresgenerales;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update gen_valoresgenerales set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idgen_valoresgenerales=' + n_idgen_valoresgenerales + ' ',
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

const getTraGrupos = (request, response) => {
    var obj = valida.validaToken(request)
    let stringBuscar = '%'+ request.body.stringBuscar+'%';
    if (obj.estado) {

        let cadena = 'with redes as (\n\r'+
                        'select gr.n_idtra_grupo, count(grl.n_borrado) as nredes from tra_grupo gr\n\r'+
                                'inner join pro_proyecto pro on pro.n_idpro_proyecto = gr.n_idpro_proyecto   \n\r'+
                                'left outer join tra_grupolinea grl on grl.n_idtra_grupo = gr.n_idtra_grupo and grl.n_borrado = 0 \n\r'+
                                'where gr.n_borrado = 0 and (gr.n_idpro_proyecto = $1) \n\r'+
                                'group by gr.n_idtra_grupo \n\r'+
                    ') \n\r'+
                    'select gr.n_idtra_grupo, gr.n_idpro_proyecto, gr.c_nombre, count(tra.b_activo) as nusersactivo, r.nredes from tra_grupo gr \n\r'+
                                'inner join pro_proyecto pro on pro.n_idpro_proyecto = gr.n_idpro_proyecto  \n\r'+
                                'left outer join tra_grupousuario tra on tra.n_idtra_grupo = gr.n_idtra_grupo and tra.b_activo is true \n\r'+
                                'left outer join redes r on r.n_idtra_grupo = gr.n_idtra_grupo \n\r'+
                                'where gr.n_borrado = 0 and (gr.n_idpro_proyecto = $1) and gr.c_nombre like \''+stringBuscar+'\' \n\r'+
                                'group by gr.n_idtra_grupo, gr.n_idpro_proyecto, gr.c_nombre,r.nredes '
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

const savetraGrupos = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idtra_grupo = request.body.n_idtra_grupo
        let n_idpro_proyecto = request.body.n_idpro_proyecto;
        let c_nombre = request.body.c_nombre;
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idtra_grupo from tra_grupo where n_borrado = 0 and n_idtra_grupo =\'' + n_idtra_grupo + '\')) then \n\r' +
            '           update tra_grupo set c_nombre= \'' + c_nombre + '\', n_idpro_proyecto=' + n_idpro_proyecto + ', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idtra_grupo =\'' + n_idtra_grupo + '\'; \n\r' +
            '       else \n\r' +
            '           insert into tra_grupo(n_idtra_grupo, c_nombre, n_idpro_proyecto, n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',' + n_idpro_proyecto + ',0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deletetraGrupos = (request, response) => {
    var obj = valida.validaToken(request)
    let n_id_usermodi = request.body.n_id_usermodi;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    if (obj.estado) {
        pool.query('update tra_grupo set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idtra_grupo=' + n_idtra_grupo + ' ',
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

const getProUser = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let cadena = 'select us.n_idseg_userprofile as n_idseg_userprofileusu, us.c_username, gru.n_idtra_grupo, gru.n_idseg_userprofile, gru.b_activo from seg_userprofile us \n\r' +
            'left join tra_grupousuario gru on gru.n_idseg_userprofile = us.n_idseg_userprofile and  gru.n_idtra_grupo = $1 or (gru.n_idseg_userprofile = null)   \n\r' +
            'inner join pro_usuarioproyecto pro on pro.n_idseg_userprofile = us.n_idseg_userprofile and pro.n_idpro_proyecto = $2   \n\r' +
            'where us.n_borrado = 0'
        pool.query(cadena,
            [request.body.n_idtra_grupo, request.body.n_idpro_proyecto],
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
            'where n_idtra_grupo = $1 and n_borrado = 0'
        pool.query(cadena, [request.body.n_idtra_grupo],
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

const saveProUser = (request, response) => {

    var obj = valida.validaToken(request)
    let n_idseg_userprofileArray = request.body.n_idseg_userprofileArray;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    let n_id_usermodi = request.body.n_id_usermodi;
    let i = 0;
    console.log(n_idseg_userprofileArray);
    if (obj.estado) {

        n_idseg_userprofileArray.forEach(async n_idseg_userprofile => {
            try {
                let cadena = 'do $$ \n\r' +
                '   begin \n\r' +
                '       if(exists(select n_idtra_grupo, n_idseg_userprofile from tra_grupousuario where n_idtra_grupo = ' + n_idtra_grupo + ' and n_idseg_userprofile = ' + n_idseg_userprofile + ')) then \n\r' +
                '           update tra_grupousuario set b_activo = true, n_is_usermodi = '+n_id_usermodi+'	where n_idseg_userprofile = ' + n_idseg_userprofile + ' and n_idtra_grupo = ' + n_idtra_grupo + '; \n\r' +
                '       else \n\r' +
                '           INSERT INTO tra_grupousuario(n_idtra_grupousuario, n_idtra_grupo, n_idseg_userprofile, b_activo, n_borrado, n_id_usercrea, d_fechacrea) \n\r' +
                '           VALUES (default, ' + n_idtra_grupo + ', ' + n_idseg_userprofile + ', true, 0, '+n_id_usermodi+', now()); \n\r' +
                '       end if; \n\r' +
                '   end \n\r' +
                '$$';
                i++
                await pool.query(cadena)
            } catch (error) {
                
            }
        });
        if (n_idseg_userprofileArray.length <= i) {
            response.status(200).json({ estado: true, mensaje: "", data: null })
        }
    } else {
        response.status(200).json(obj)
    }

}

const denegarAllProuser = (request, response) => {

    var obj = valida.validaToken(request)
    let n_idseg_userprofileArray = request.body.n_idseg_userprofileArray;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    let n_id_usermodi = request.body.n_id_usermodi;
    let i = 0;
    console.log(n_idseg_userprofileArray);
    if (obj.estado) {

        n_idseg_userprofileArray.forEach(async n_idseg_userprofile => {
            try {
                let cadena = 'do $$ \n\r' +
                '   begin \n\r' +
                '       if(exists(select n_idtra_grupo, n_idseg_userprofile from tra_grupousuario where n_idtra_grupo = ' + n_idtra_grupo + ' and n_idseg_userprofile = ' + n_idseg_userprofile + ')) then \n\r' +
                '           update tra_grupousuario set b_activo = false, n_is_usermodi = '+n_id_usermodi+'	where n_idseg_userprofile = ' + n_idseg_userprofile + ' and n_idtra_grupo = ' + n_idtra_grupo + '; \n\r' +
                '       else \n\r' +
                '           INSERT INTO tra_grupousuario(n_idtra_grupousuario, n_idtra_grupo, n_idseg_userprofile, b_activo, n_borrado, n_id_usercrea, d_fechacrea) \n\r' +
                '           VALUES (default, ' + n_idtra_grupo + ', ' + n_idseg_userprofile + ', false, 0, '+n_id_usermodi+', now()); \n\r' +
                '       end if; \n\r' +
                '   end \n\r' +
                '$$';
                i++
                await pool.query(cadena)
            } catch (error) {
                
            }
        });
        if (n_idseg_userprofileArray.length <= i) {
            response.status(200).json({ estado: true, mensaje: "", data: null })
        }
    } else {
        response.status(200).json(obj)
    }

}

const getLineaUser = (request, response) => {
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
    console.log("QUITAR ASIGANCIÓN");
    var obj = valida.validaToken(request)
    console.log(request.body.n_idpl_linea);
    console.log(request.body.n_idtra_grupo);
    let arr_n_idpl_linea = request.body.n_idpl_linea;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    let n_id_usermodi = request.body.n_id_usermodi;
    let i = 0;
    
    if (obj.estado) {
        arr_n_idpl_linea.forEach(async id_linea => {
            try {
                let cadena = 'do $$ \n\r' +
                '   begin \n\r' +
                '       if(exists(select n_idtra_grupo, n_idpl_linea from tra_grupolinea where n_idpl_linea =' + id_linea + ' and n_idtra_grupo = ' + n_idtra_grupo + ')) then \n\r' +
                '           update tra_grupolinea set n_borrado = 1, n_is_usermodi ='+n_id_usermodi+' where n_idpl_linea =' + id_linea + ' and n_idtra_grupo = ' + n_idtra_grupo + '; \n\r' +
                '       else \n\r' +
                '           INSERT INTO tra_grupolinea(n_idtra_grupolinea, n_idpl_linea, n_idtra_grupo, n_borrado, n_id_usercrea, d_fechacrea) \n\r' +
                '           VALUES (default, ' + id_linea + ', ' + n_idtra_grupo + ', 1, '+n_id_usermodi+', now()); \n\r' +
                '       end if; \n\r' +
                '   end \n\r' +
                '$$';
                i++;
                await pool.query(cadena)
            } catch (error) {
                
            }
        });
        if (arr_n_idpl_linea.length <= i) {
            response.status(200).json({ estado: true, mensaje: "", data: null })
        }
    } else {
        response.status(200).json(obj)
    }
}

const asignarLineaUser = (request, response) => {
    //ASIGNAR
    var obj = valida.validaToken(request)
    console.log(request.body.n_idpl_linea);
    console.log(request.body.n_idtra_grupo);
    let arr_n_idpl_linea = request.body.n_idpl_linea;
    let n_idtra_grupo = request.body.n_idtra_grupo;
    let n_id_usermodi = request.body.n_id_usermodi;
    let i = 0;
    if (obj.estado) {
        arr_n_idpl_linea.forEach(async id_linea => {
            try {
                let cadena = 'do $$ \n\r' +
                '   begin \n\r' +
                '       if(exists(select n_idtra_grupo, n_idpl_linea from tra_grupolinea where n_idpl_linea =' + id_linea + ' and n_idtra_grupo = ' + n_idtra_grupo + ')) then \n\r' +
                '           update tra_grupolinea set n_borrado = 0, n_is_usermodi ='+n_id_usermodi+' where n_idpl_linea =' + id_linea + ' and n_idtra_grupo = ' + n_idtra_grupo + '; \n\r' +
                '       else \n\r' +
                '           INSERT INTO tra_grupolinea(n_idtra_grupolinea, n_idpl_linea, n_idtra_grupo, n_borrado, n_id_usercrea, d_fechacrea) \n\r' +
                '           VALUES (default, ' + id_linea + ', ' + n_idtra_grupo + ', 0, '+n_id_usermodi+', now()); \n\r' +
                '       end if; \n\r' +
                '   end \n\r' +
                '$$';
                i++;
                await pool.query(cadena)
                
            } catch (error) {
                
            }
        });
        if (arr_n_idpl_linea.length <= i) {
            response.status(200).json({ estado: true, mensaje: "", data: null})
        }
    } else {
        response.status(200).json(obj)
    }

}

const getTipoElemento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        pool.query('select n_idpl_tipoelemento, c_nombre, c_codigo, split_part(c_codigo,\'_\',1) as div, split_part(c_codigo,\'_\',2)::DECIMAL as div2 from pl_tipoelemento  ' +
            'where n_borrado = 0 and n_idpro_proyecto = $1 order by div asc, div2 asc',
            [request.body.n_idpro_proyecto],
            (error, results) => {
                if (error) {
                    console.log(error);
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
            '           update pl_tipoelemento set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_tipoelemento = \'' + n_idpl_tipoelemento + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into pl_tipoelemento(n_idpl_tipoelemento, c_nombre,c_codigo, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\', 0,now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteTipoElemento = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idpl_tipoelemento = request.body.n_idpl_tipoelemento;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update pl_tipoelemento set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpl_tipoelemento=' + n_idpl_tipoelemento + ' ',
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

const getTablaCateTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idmon_categoriatipomontaje, c_nombre, c_codigo, split_part(c_codigo,\'_\',1) as div, split_part(c_codigo,\'_\',2)::DECIMAL as div2, n_idpro_proyecto from mon_categoriatipomontaje ' +
            ' where n_borrado = 0 and n_idpro_proyecto= $1 order by div asc, div2 asc',
            [request.body.n_idpro_proyecto],
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

const saveCateTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idmon_categoriatipomontaje = request.body.n_idmon_categoriatipomontaje;
        let c_nombre = request.body.c_nombre;
        let c_codigo = request.body.c_codigo;
        let n_id_usermodi = request.body.n_id_usermodi;
        let n_idpro_proyecto = request.body.n_idpro_proyecto;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idmon_categoriatipomontaje from mon_categoriatipomontaje where n_idmon_categoriatipomontaje = \'' + n_idmon_categoriatipomontaje + '\' and n_idpro_proyecto = '+n_idpro_proyecto+')) then \n\r' +
            '           update mon_categoriatipomontaje set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idmon_categoriatipomontaje = \'' + n_idmon_categoriatipomontaje + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into mon_categoriatipomontaje(n_idmon_categoriatipomontaje, c_nombre,c_codigo, n_idpro_proyecto ,n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\', '+n_idpro_proyecto+',0,now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteCateTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idmon_categoriatipomontaje = request.body.n_idmon_categoriatipomontaje;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update mon_categoriatipomontaje set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idmon_categoriatipomontaje=' + n_idmon_categoriatipomontaje + ' ',
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
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'update pro_proyecto set c_rutaimg= \'' + c_rutaimg + '\', n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpro_proyecto = \'' + n_idpro_proyecto + '\' ';
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
        let cadena = 'update pro_proyecto set c_rutalogo= \'' + c_rutalogo + '\', n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpro_proyecto = \'' + n_idpro_proyecto + '\' ';
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

        let cadena = 'update pro_proyecto set c_color= \'' + c_color + '\', n_is_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idpro_proyecto = \'' + n_idpro_proyecto + '\' ';
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

const getTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select tp.n_idmon_tipomontaje, tp.c_codigo, tp.c_nombre, split_part(tp.c_codigo,\'_\',1) as div, split_part(tp.c_codigo,\'_\',2) as div2, tp.n_idmon_categoriatipomontaje,ctp.c_nombre as nombrecat, pl.n_idpl_tipolinea,pl.c_nombre as nombretp,tp.c_unidadmedida from mon_tipomontaje tp ' +
            'inner join mon_categoriatipomontaje ctp on ctp.n_idmon_categoriatipomontaje = tp.n_idmon_categoriatipomontaje and ctp.n_borrado = 0 and ctp.n_idpro_proyecto = $1 ' +
            'inner join pl_tipolinea pl on pl.n_idpl_tipolinea = tp.n_idpl_tipolinea and pl.n_borrado = 0 ' +
            'where tp.n_borrado = 0 and (tp.n_idmon_categoriatipomontaje = $2 or 0 = $2) and (tp.n_idpl_tipolinea = $3 or 0 = $3)' +
            'order by div asc, div2 asc',
            [request.body.n_idpro_proyecto, request.body.n_idmon_categoriatipomontaje, request.body.n_idpl_tipolinea],
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al traer Tipo Montaje!.", data: null })
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
        let n_idmon_tipomontaje = request.body.n_idmon_tipomontaje;
        let c_codigo = request.body.c_codigo;
        let c_nombre = request.body.c_nombre;
        let n_idmon_categoriatipomontaje = request.body.n_idmon_categoriatipomontaje;
        let n_idpl_tipolinea = request.body.n_idpl_tipolinea;
        let c_unidadmedida = request.body.c_unidadmedida;
        let n_id_usermodi = request.body.n_id_usermodi;

        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idmon_tipomontaje from mon_tipomontaje where n_idmon_tipomontaje = \'' + n_idmon_tipomontaje + '\')) then \n\r' +
            '           update mon_tipomontaje set c_nombre= \'' + c_nombre + '\', c_codigo=\'' + c_codigo + '\', n_idmon_categoriatipomontaje=' + n_idmon_categoriatipomontaje + ',n_idpl_tipolinea=' + n_idpl_tipolinea + ',c_unidadmedida=\'' + c_unidadmedida + '\',n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idmon_tipomontaje = \'' + n_idmon_tipomontaje + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into mon_tipomontaje(n_idmon_tipomontaje, c_nombre,c_codigo, n_idmon_categoriatipomontaje,n_idpl_tipolinea,c_unidadmedida,n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_nombre + '\',\'' + c_codigo + '\', ' + n_idmon_categoriatipomontaje + ',' + n_idpl_tipolinea + ',\'' + c_unidadmedida + '\',0,now(), ' + n_id_usermodi + '); \n\r' +
            '       end if; \n\r' +
            '   end \n\r' +
            '$$';
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al guardar.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })

    } else {
        response.status(200).json(obj)
    }
}

const deleteTipoMontaje = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idmon_tipomontaje = request.body.n_idmon_tipomontaje;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update mon_tipomontaje set n_borrado= 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idmon_tipomontaje=' + n_idmon_tipomontaje,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getVersion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idv_cabecera, c_cabecera, c_fecha  from v_cabecera where n_borrado = 0',
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al traer Versión!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveVersion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idv_cabecera = request.body.n_idv_cabecera;
        let c_cabecera = request.body.c_cabecera;
        let c_fecha = request.body.c_fecha;
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idv_cabecera from v_cabecera where n_idv_cabecera =\'' + n_idv_cabecera + '\')) then \n\r' +
            '           update v_cabecera set c_cabecera= \'' + c_cabecera + '\', c_fecha = \''+c_fecha+'\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idv_cabecera = \'' + n_idv_cabecera + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into v_cabecera(n_idv_cabecera, c_cabecera, c_fecha, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,\'' + c_cabecera + '\', \'' + c_fecha + '\',0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteVersion = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idv_cabecera = request.body.n_idv_cabecera;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update v_cabecera set n_borrado = 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi = now() where n_idv_cabecera=' + n_idv_cabecera,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getDetalleVersion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select dv.n_idv_detalle, dv.n_idv_cabecera, dv.c_detalle, dv.n_borrado from v_detalle dv '+
                        'inner join v_cabecera ca on ca.n_idv_cabecera = dv.n_idv_cabecera and ca.n_borrado = 0 ' +
                    'where dv.n_borrado = 0	and dv.n_idv_cabecera = $1',
            [request.body.n_idv_cabecera],
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error al traer Versión!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const saveDetalleVersion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idv_detalle = request.body.n_idv_detalle;
        let n_idv_cabecera = request.body.n_idv_cabecera;
        let c_detalle = request.body.c_detalle;
        let n_id_usermodi = request.body.n_id_usermodi;
        let cadena = 'do $$ \n\r' +
            '   begin \n\r' +
            '       if(exists(select n_idv_detalle from v_detalle where n_idv_detalle =\'' + n_idv_detalle + '\')) then \n\r' +
            '           update v_detalle set c_detalle= \'' + c_detalle + '\', n_id_usermodi=' + n_id_usermodi + ', d_fechamodi= now() where n_idv_detalle = \'' + n_idv_detalle + '\' ; \n\r' +
            '       else \n\r' +
            '           insert into v_detalle(n_idv_detalle, n_idv_cabecera, c_detalle, n_borrado, d_fechacrea, n_id_usercrea) \n\r' +
            '           values (default,' + n_idv_cabecera +', \'' + c_detalle + '\',0, now(), ' + n_id_usermodi + '); \n\r' +
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

const deleteDetalleVersion = (request, response) => {
    var obj = valida.validaToken(request)
    let n_idv_detalle = request.body.n_idv_detalle;
    let n_id_usermodi = request.body.n_id_usermodi;
    if (obj.estado) {
        pool.query('update v_detalle set n_borrado = 1, n_id_usermodi=' + n_id_usermodi + ', d_fechamodi = now() where n_idv_detalle=' + n_idv_detalle,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error2!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getVersiones = (request, response) => {

        pool.query('select vc.n_idv_cabecera, vc.c_cabecera, vc.c_fecha, vd.n_idv_cabecera as n_idv_cabeceradt, vd.c_detalle  from v_cabecera vc '+
            'inner join v_detalle vd on vd.n_idv_cabecera = vc.n_idv_cabecera and vd.n_borrado = 0 '+
            'where vc.n_borrado = 0 order by vc.n_idv_cabecera desc ', 
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
}

const getNotificacion = (request, response) => {
    pool.query('select * from g_notificacion \n\r' +
    'where n_borrado = 0 and n_idseg_userprofile = $1 and n_idpro_proyecto = $2 \n\r' +
    'order by n_idg_notificacion desc limit 10',
        [request.body.n_idseg_userprofile, request.body.n_idpro_proyecto], 
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const getNotificacionDetalle = (request, response) => {
    pool.query('select g.n_idg_notificacionmon, g.n_idg_notificacion, g.c_codigo_mon from g_notificacionmon as g \n\r' +
	        'inner join g_notificacion n on g.n_idg_notificacion = n.n_idg_notificacion and n.n_borrado = 0 \n\r' +
	        'where n.n_idseg_userprofile = $1',
        [request.body.n_idseg_userprofile], 
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const showNotificacion = (request, response) => {
    pool.query('update g_notificacion set b_estado = true  where n_idg_notificacion = $1',
        [request.body.n_idg_notificacion], 
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
            } else {
                response.status(200).json({ estado: true, mensaje: "", data: results.rows })
            }
        })
}

const getMonInspeccionPopup =  (request, response) => {
    var obj = valida.validaToken(request)
  
    if (obj.estado) {          
      let cadena = 'select m.n_idmon_inspeccion, m.c_codigo, m.c_latitud, m.c_longitud, m.n_precision, m.n_altitud, to_char(m.d_fecha, \'DD/MM/YYYY HH24:MI:SS\') as d_fecha, m.n_idpl_linea, m.n_tipoapp, pl.c_codigo as c_codigol, pl.c_nombre as c_nombrel, pt.n_idpl_tipolinea, pt.c_codigo as c_codigotl, pt.c_nombre as c_nombretl, z.n_idpl_zona, z.c_codigo as c_codigoz, su.c_username, su.c_nombre1, su.c_nombre2, su.c_appaterno, su.c_apmaterno  from mon_inspeccion m \n\r' +
            'inner join pl_linea pl on pl.n_idpl_linea = m.n_idpl_linea and pl.n_borrado = 0 \n\r' +
            'inner join pl_tipolinea pt on pt.n_idpl_tipolinea = pl.n_idpl_tipolinea and pt.n_borrado = 0 \n\r' +
            'inner join pl_zona z ON pl.n_idpl_zona = z.n_idpl_zona AND z.n_borrado = 0 \n\r' +
            'inner join g_notificacionmon gm on gm.c_codigo_mon = m.c_codigo  \n\r' +
        'inner join seg_userprofile su on su.n_idseg_userprofile = m.n_id_usercrea and su.n_borrado = 0 \n\r' +
        'where m.n_borrado = 0 and z.n_idpro_proyecto = $1 and (gm.n_idg_notificacion = $2) \n\r' +
      'order by m.n_idmon_inspeccion desc ';
  
      pool.query(cadena,[request.body.n_idpro_proyecto, request.body.n_idg_notificacion],   
          (error, results) => {
              if (error) {
                  console.log(cadena);
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

  const getinspeccionxlspopup= async (request, response) => {
    console.log("asdasdWOW");
    var session = valida.validaToken(request)
    if(session.estado){
      console.log("getinspeccionxls", request.body)
      let query = await pool.query('select * from vw_inspeccionxls_popup '+
      ' where (0 = $1 or n_idg_notificacion = $1) '
      ,[
        request.body.n_idg_notificacion
      ])
      response.status(200).json({ estado: true, mensaje: "", data: query.rows })
  
    }else{
      response.status(200).json(session)
    }
  }

  
const getAlmacenPopup =  (request, response) => {
    var obj = valida.validaToken(request)
  
    if (obj.estado) {          
        let cadena = 'select guia.n_idalm_guia, guia.n_idalm_almacen, pe.n_idgen_periodo, guia.c_nombre, guia.c_direccion, al.c_nombre as c_nombreal, pe.c_descripcion as periodo, split_part(pe.c_descripcion,\' \',1) as mes,pe.n_mes, split_part(pe.c_descripcion,\' \',2)::INT as annio,guia.c_ruc, guia.c_nroguia, guia.c_observacion from alm_guia guia \n\r' +
        'inner join alm_almacen al on al.n_idalm_almacen = guia.n_idalm_almacen \n\r' +   
        'inner join gen_periodo pe on pe.n_idgen_periodo = guia.n_idgen_periodo \n\r' +    
        'inner join g_notificacion_alm g on g.n_idalm_guia = guia.n_idalm_guia and g.n_borrado = 0 \n\r' +  
        'where guia.n_borrado = 0 and and g.n_idg_notificacion = $1 '+
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
      pool.query(cadena,[request.body.n_idg_notificacion],   
          (error, results) => {
              if (error) {
                  console.log(cadena);
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

module.exports = {
    getempresa,
    saveEmpresa,
    deleteEmpresa,
    saveLinea,
    getLinea,
    deleteLinea,
    estadoLinea,
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
    denegarAllProuser,
    getLineaUser,
    noAsignarLineaUser,
    asignarLineaUser,
    getTipoElemento,
    saveTipoElemento,
    deleteTipoElemento,
    getTablaCateTipoMontaje,
    saveCateTipoMontaje,
    deleteCateTipoMontaje,
    saveProImg,
    saveProImgLogo,
    saveColorPro,
    getTipoMontaje,
    saveTipoMontaje,
    deleteTipoMontaje,
    getVersion,
    deleteVersion,
    saveVersion,
    getDetalleVersion,
    deleteDetalleVersion,
    saveDetalleVersion,
    getVersiones,
    getNotificacion,
    getNotificacionDetalle,
    showNotificacion,
    getMonInspeccionPopup,
    getinspeccionxlspopup,
    getAlmacenPopup
}
