
const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const exportar= (request, response)=> {
    var obj = valida.validaToken(request)
    if(obj.estado){
        console.log(request.body.n_idpro_proyecto, request.body.idversion, request.body.idlinea);
        let cadena = 'select * from fn_exportardatalinea($3,$2,$1);';
                pool.query(cadena,[request.body.n_idpro_proyecto, request.body.idversion, request.body.idlinea],(error, results)=>{
                    if(error){
                        console.log(error)
                        response.status(200).json({ estado: false, mensaje: "DB: error al traer los datos2!.", data: null })   
                    }else{
                        var datos = results.rows;   
                        //console.log(datos);                     
                        response.status(200).json({ estado: true, mensaje: "", data:  datos });
                    }
                })
    }else{
        response.status(200).json(obj)
    }
    
}



module.exports = {
    exportar
}