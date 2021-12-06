const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const get = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select ' +
            't.n_idgen_tarea, ' +
            't.n_idgen_actividad, ' +
            'coalesce(tpt.n_idgen_tipoproyectotarea, 0) n_idgen_tipoproyectotarea,  ' +
            'coalesce(tpt.n_idgen_tipoproyecto, 0) n_idgen_tipoproyecto,  ' +
            'case when tpt.n_idgen_tipoproyectotarea is null then false else true end b_flag, ' +
            't.c_descripcion,     ' +
            'c_valor,   ' +
            'n_tipo  ' +
            'from gen_tarea t ' +
            'left outer join gen_tipoproyectotarea tpt on t.n_idgen_tarea = tpt.n_idgen_tarea and tpt.n_borrado = 0 and tpt.n_idgen_tipoproyecto= $1 ' +
            'where t.n_borrado = 0 and t.n_idgen_actividad=$2 order by t.n_orden',
            [request.body.n_idgen_tipoproyecto, request.body.n_idgen_actividad],
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

const get_tarea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select t.N_idgen_tarea,t.n_idgen_actividad,t.c_valor,t.c_descripcion,t.n_tipo,t.n_idgen_predecesora,t2.c_descripcion c_predecesora,t.n_duracion,t.b_diasferiados, t.b_hitocontrol from gen_tarea t ' +
            'left outer join gen_tarea t2 on t.n_idgen_predecesora = t2.n_idgen_tarea  ' +
            'where t.n_borrado = 0 and (t.n_idgen_actividad = $1 or 0 = $1 ) order by t.n_orden',
            [request.body.n_idgen_actividad],
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

const get_fase = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_fase, c_nombre from gen_fase where n_borrado = 0',
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


const get_actividad = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select n_idgen_actividad,n_idgen_fase,c_valor,c_descripcion from gen_actividad where n_borrado = 0 and ( n_idgen_fase=$1 or 0=$1)', [request.body.n_idgen_fase],
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

const get_datoadicional = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select da.n_idgen_datoadicional,da.c_dato,da.c_tipodato,da.n_idgen_tarea,c_unidad from gen_datoadicional da ' +
            'where da.n_borrado = 0  and da.n_idgen_tarea =$1', [request.body.n_idgen_tarea],
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

const save_fase = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_fase = request.body.n_idgen_fase;
        let c_nombre = request.body.c_nombre;
        let cadena = '';
        if (n_idgen_fase == 0) {
            cadena = 'insert into gen_fase(n_idgen_fase,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,\'' + c_nombre + '\',0,now(),1);';
        } else {
            cadena = 'update gen_fase set c_nombre= \'' + c_nombre + '\' where n_idgen_fase=' + n_idgen_fase + ';';
        }

        pool.query(cadena,
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

const save_actividad = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_actividad = request.body.n_idgen_actividad;
        let n_idgen_fase = request.body.n_idgen_fase;
        let c_valor = request.body.c_valor;
        let c_descripcion = request.body.c_descripcion; 
        let cadena = '';
        if (n_idgen_actividad == 0) {
            cadena = 'insert into gen_actividad(n_idgen_actividad,n_idgen_fase,c_valor,c_descripcion,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_fase + ',\'' + c_valor + '\',\''+c_descripcion+'\',0,now(),1);';
        } else {
            cadena = 'update gen_actividad set c_descripcion= \'' + c_descripcion + '\',c_valor= \'' + c_valor + '\', n_idgen_fase = ' + n_idgen_fase + ' where n_idgen_actividad=' + n_idgen_actividad + ';';
        }

        pool.query(cadena,
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

const save_tarea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_tarea = request.body.n_idgen_tarea;
        let n_idgen_actividad = request.body.n_idgen_actividad;
        let c_descripcion = request.body.c_descripcion;
        let n_idgen_predecesora = request.body.n_idgen_predecesora;
        let n_duracion = request.body.n_duracion;
        let b_diasferiados = request.body.b_diasferiados;
        let b_hitocontrol = request.body.b_hitocontrol;
      


        if (n_idgen_predecesora == undefined) {
            n_idgen_predecesora = null;
        }

        if (b_hitocontrol == undefined) {
            b_hitocontrol = null;
        }

        let cadena = '';
        if (n_idgen_tarea == 0) {
            cadena = 'insert into gen_tarea(n_idgen_tarea,n_idgen_actividad,c_descripcion,n_idgen_predecesora,n_duracion,b_diasferiados,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_actividad + ',\'' + c_descripcion + '\',' + n_idgen_predecesora + ',' + n_duracion + ',' + b_diasferiados +','+b_hitocontrol+ ',0,now(),1);';
        } else {
            cadena = 'update gen_tarea set c_descripcion= \'' + c_descripcion + '\',n_idgen_actividad = ' + n_idgen_actividad + ',n_idgen_predecesora=' + n_idgen_predecesora + ',n_duracion=' + n_duracion + ',b_diasferiados=' + b_diasferiados + ',b_hitocontrol='+b_hitocontrol+
            ' where n_idgen_tarea=' + n_idgen_tarea + ';';
        }

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(cadena);

                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const save_tipoproyecto_tarea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_tipoproyectotarea = request.body.n_idgen_tipoproyectotarea;
        let n_idgen_tipoproyecto = request.body.n_idgen_tipoproyecto;
        let n_idgen_tarea = request.body.n_idgen_tarea;
        let cadena = '';
        if (n_idgen_tipoproyectotarea == 0) {
            cadena = 'insert into gen_tipoproyectotarea(n_idgen_tipoproyectotarea,n_idgen_tipoproyecto,n_idgen_tarea,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,' + n_idgen_tipoproyecto + ',' + n_idgen_tarea + ',0,now(),1);';
        }
        console.log(cadena)
        pool.query(cadena,
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

const save_datoadicional_tarea = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_datoadicional = request.body.n_idgen_datoadicional;
        let c_dato = request.body.c_dato;
        let c_tipodato = request.body.c_tipodato;
        let n_idgen_tarea = request.body.n_idgen_tarea;
        let c_unidad = request.body.c_unidad;

        let cadena = '';
        if (n_idgen_datoadicional == 0) {
            cadena = 'insert into gen_datoadicional(n_idgen_datoadicional,c_dato,c_tipodato,n_idgen_tarea,c_unidad,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,\'' + c_dato + '\',\'' + c_tipodato + '\',' + n_idgen_tarea + ',\'' + c_unidad + '\',0,now(),1);';
        }else{
            cadena = 'update gen_datoadicional set c_dato=\''+c_dato+'\', c_tipodato =\''+c_tipodato+'\',c_unidad=\''+c_unidad+'\' where n_idgen_datoadicional ='+n_idgen_datoadicional+';';
        }
        console.log(cadena)

        pool.query(cadena,
            (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error!. "+error.stack, data: null })
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
        let n_idgen_tipoproyecto = request.body.n_idgen_tipoproyecto;
        let c_nombre = request.body.c_nombre;
        let cadena = '';
        if (n_idgen_tipoproyecto == 0) {
            cadena = 'insert into gen_tipoproyecto(n_idgen_tipoproyecto,c_nombre,n_borrado,d_fechacrea,n_id_usercrea) \n\r' +
                'values (default,\'' + c_nombre + '\',0,now(),1);';
        } else {
            cadena = 'update gen_tipoproyecto set c_nombre= \'' + c_nombre + '\' where n_idgen_tipoproyecto=' + n_idgen_tipoproyecto + ';';
        }

        pool.query(cadena,
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

const delete_tarea = (request, response) => {
    var obj = valida.validaToken(request)

    if (obj.estado) {

        let n_idgen_tarea = request.body.n_idgen_tarea;
        let cadena = '';
        if (n_idgen_tarea > 0) {

            cadena = 'update gen_tarea set n_borrado= n_idgen_tarea where n_idgen_tarea=' + n_idgen_tarea + ';';
        }

        pool.query(cadena,
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

const delete_actividad = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_actividad = request.body.n_idgen_actividad;
        let cadena = '';
        if (n_idgen_actividad > 0) {
            cadena = 'update gen_actividad set n_borrado= n_idgen_actividad where n_idgen_actividad=' + n_idgen_actividad + ';';
        }

        pool.query(cadena,
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

const delete_fase = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_fase = request.body.n_idgen_fase;
        let cadena = '';
        if (n_idgen_fase > 0) {
            cadena = 'update gen_fase set n_borrado= n_idgen_fase where n_idgen_fase=' + n_idgen_fase + ';';
        }

        pool.query(cadena,
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



module.exports = {
    get,
    get_tarea,
    get_actividad,
    get_fase,
    get_datoadicional,
    save,
    save_fase,
    save_actividad,
    save_tarea,
    save_tipoproyecto_tarea,
    save_datoadicional_tarea,
    delete_actividad,
    delete_fase,
    delete_tarea

}
