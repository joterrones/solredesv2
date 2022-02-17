
const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const exportar= (request, response)=> {
    var obj = valida.validaToken(request)
    if(obj.estado){

        let cadena = 'select ea.n_idpl_estructuraarmado, pl.c_nombre, pe.c_nro_se, pe.c_circuito, pe.c_codigonodo, pa.c_codigo as codigoap, pa.c_codigo as c_codigoas, \n\r' +
                ' pa.c_codigo as c_codigoarsse, pe.c_progresiva, pe.c_cota, pe.c_vertice, pe.c_angulo, pe.c_tipoterreno, ea.n_cantidad as n_cantidadea, \n\r'+
                ' pe.c_etiquetaestructura, pe.c_longitud, pe.c_latitud, pst.c_etiquetacorto, psta.n_cantidad as n_cantidadpsta, ea.n_orientacion, \n\r'+
                ' pe.n_fases, pe.c_funcion \n\r'+
                ' from pl_estructura pe \n\r'+
                ' inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0\n\r'+
                ' inner join pl_estructuraarmado ea on pe.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0 \n\r'+
                ' inner join pl_armado pa on ea.n_idpl_armado = pa.n_idpl_armado and pa.n_borrado = 0 \n\r'+
                ' inner join pl_subtramoarmado psta on pa.n_idpl_armado = psta.n_idpl_armado and psta.n_borrado = 0 \n\r'+
                ' inner join pl_subtramo pst on psta.n_idpl_subtramo = pst.n_idpl_subtramo and pst.n_borrado = 0 \n\r'+
                ' inner join pl_zona zn on pl.n_idpl_zona = zn.n_idpl_zona and zn.n_borrado = 0 \n\r'+
                ' where pe.n_borrado = 0 and pa.n_idpro_proyecto = $1 and zn.n_idpro_proyecto = $1 \n\r'+
                ' order by pl.c_nombre asc \n\r';

        pool.query( cadena,[request.body.n_idpro_proyecto], 
            (error, results)=>{
            if(error){
                console.log(error)
                response.status(200).json({ estado: false, mensaje: "DB: error al traer los datos!.", data: null })   
            }else{
                var datos = results.rows;
                let cadena = ' select ea.n_idpl_estructuraarmado, ea.n_cantidad,ea.n_idpl_armado, pa.c_codigo, ea.n_orientacion from pl_estructuraarmado ea \n\r'+
                            ' inner join pl_armado pa on ea.n_idpl_armado = pa.n_idpl_armado and pa.n_borrado = 0\n\r'+
                            ' where ea.n_borrado = 0 and pa.n_idpro_proyecto = $1 \n\r'+
                            ' order by ea.n_idpl_estructuraarmado asc \n\r';
                pool.query(cadena,[request.body.n_idpro_proyecto],(error, results)=>{
                    if(error){
                        console.log(error)
                        response.status(200).json({ estado: false, mensaje: "DB: error al traer los datos2!.", data: null })   
                    }else{
                        var datos2 = results.rows;                        
                        response.status(200).json({ estado: true, mensaje: "", data: {datos: datos, datos2: datos2} });
                    }
                })
                
            }

        })
    }else{
        response.status(200).json(obj)
    }
    
}



module.exports = {
    exportar
}