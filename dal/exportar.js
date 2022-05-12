
const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const exportar= (request, response)=> {
    var obj = valida.validaToken(request)
    if(obj.estado){
        console.log(request.body.n_idpro_proyecto, request.body.idversion, request.body.idzona, request.body.idtipolinea, request.body.idlinea);
        let cadena = ' with poste as ( \n\r'+
                    'Select p.n_idpl_estructura, a.c_codigo, ea.n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura          \n\r'+           
                    'where a.n_borrado = 0 and a.n_idpl_tipoarmado = 5 and a.c_codigo <> \''+'0'+'\' \n\r'+
                '), \n\r'+
                'Amortiguador_35 as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 6 and a.c_codigo = \''+'Amortiguador_35'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'Amortiguador_70 as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.n_idpl_tipoarmado = 6 and a.c_codigo = \''+'Amortiguador_70'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'ri_a as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.n_idpl_tipoarmado = 1 and a.c_codigo = \''+'RI-A'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'rv_a as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 1 and a.c_codigo = \''+'RV-A'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RI_MT as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.c_codigo = \''+'RI-MT'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RV_MT as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'RV-MT'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RI as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 1 and a.c_codigo = \''+'RI'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RV as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 1 and a.c_codigo = \''+'RV'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RIY as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.c_codigo = \''+'RIY'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'RVY AS ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'RVY'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_1 AS ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 3 and a.c_codigo = \''+'PAT-1'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_1C as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 3 and a.c_codigo = \''+'PAT-1C'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_2 as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.n_idpl_tipoarmado = 3 and a.c_codigo = \''+'PAT-2'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_3 as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 3 and a.c_codigo = \''+'PAT-3'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_1CS as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.c_codigo = \''+'PAT-1CS'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_2S as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'PAT-2S'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_3S as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'PAT-3S'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'PAT_1S as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'PAT-1S'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'AP_BT as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.n_idpl_tipoarmado = 9 and a.c_codigo = \''+'AP_BT'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'AP_MT as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo, Sum(ea.n_cantidad)n_cantidad from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado  \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura  \n\r'+
                    'where a.c_codigo = \''+'AP_MT'+'\' and a.n_borrado = 0 and a.n_idpro_proyecto = $1 \n\r'+
                    'group by p.n_idpl_estructura, a.c_codigo \n\r'+
                '), \n\r'+
                'linea as ( \n\r'+
                    'select pe.n_idpl_estructura, pl.c_nombre, pe.c_nro_se, pe.c_circuito, pe.c_codigonodo, ea.n_idpl_estructuraarmado, pa.n_idpl_armado,pa.c_codigo as codigoap, pa.c_codigo as c_codigoas,  \n\r'+
                    'pa.c_codigo as c_codigoarsse, pe.c_progresiva, pe.c_cota, pe.c_vertice, pe.c_angulo, pe.c_tipoterreno, \n\r'+
                    'pe.c_longitud, pe.c_latitud, pst.n_distancia as n_cantidadpsta, pst.c_etiquetacorto,  ea.n_orientacion,  \n\r'+
                    'pe.n_fases, pe.c_funcion \n\r'+
                    'from pl_estructura pe \n\r'+
                        'inner join pl_linea pl on pe.n_idpl_linea = pl.n_idpl_linea and pl.n_borrado = 0  \n\r'+
                        'inner join pl_estructuraarmado ea on pe.n_idpl_estructura = ea.n_idpl_estructura and ea.n_borrado = 0  \n\r'+
                        'inner join pl_armado pa on ea.n_idpl_armado = pa.n_idpl_armado and pa.n_borrado = 0 \n\r'+
						'inner join pl_subtramo pst on pe.n_idpl_estructura = pst.n_idpl_estructurafin or pe.n_idpl_estructura = pst.n_idpl_estructurainicio  and pst.n_borrado = 0    \n\r'+
                        'where pe.n_borrado = 0 and pa.n_idpl_tipoarmado = 2 and pe.n_idpl_tipoestructura = 9 \n\r'+
                        'order by pe.n_idpl_estructura asc, ea.n_idpl_estructuraarmado asc \n\r'+
                '),  \n\r'+
                'estruct_anterior as ( \n\r'+
                    'select pst.n_idpl_estructurafin, pe.c_codigonodo from pl_estructura pe \n\r'+
                    'inner join pl_subtramo pst on pe.n_idpl_estructura = pst.n_idpl_estructurainicio and pst.n_borrado = 0  \n\r'+
                    'where pe.n_borrado = 0 \n\r'+
                '), \n\r'+
                'tipo_trans as ( \n\r'+
                    'Select p.n_idpl_estructura as n_idpl_estructura, a.c_codigo from pl_armado a \n\r'+
                    'inner join pl_estructuraarmado ea on a.n_idpl_armado = ea.n_idpl_armado \n\r'+
                    'inner join vw_planos p on ea.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                    'where a.n_idpl_tipoarmado = 14 \n\r'+
                ') \n\r'+
                'Select p.n_idpl_estructura, a35.n_cantidad as amortiguador_35, a37.n_cantidad as amortiguador_37,  \n\r'+
                    'ri_a.n_cantidad as RI_A, rv_a.n_cantidad as RV_A, RI_MT.n_cantidad as RI_MT, RV_MT.n_cantidad as RV_MT, \n\r'+
                    'RI.n_cantidad as RI, RV.n_cantidad as RV, RIY.n_cantidad as RIY, RVY.n_cantidad as RVY, PAT_1.n_cantidad as PAT_1, \n\r'+
                    'PAT_1C.n_cantidad as PAT_1C, PAT_2.n_cantidad as PAT_2, PAT_3.n_cantidad as PAT_3, PAT_1CS.n_cantidad as PAT_1CS, \n\r'+
                    'PAT_2S.n_cantidad as PAT_2S, PAT_3S.n_cantidad as PAT_3S, PAT_1S.n_cantidad as PAT_1S, AP_BT.n_cantidad as AP_BT, \n\r'+
                    'AP_MT.n_cantidad as AP_MT, ea.c_codigonodo as estructant,\n\r'+
                    'l.c_nombre, l.c_nro_se, l.c_circuito, l.c_codigonodo, l.codigoap, l.c_codigoas, \n\r'+
                    'l.c_codigoarsse, l.c_progresiva, l.c_cota, l.c_vertice, l.c_angulo, l.c_tipoterreno, \n\r'+
                    'l.c_longitud, l.c_latitud, l.c_etiquetacorto, l.n_cantidadpsta, l.n_orientacion, l.n_fases, l.c_funcion, \n\r'+
                    'p.n_cantidad ,p.c_codigo, tt.c_codigo as c_codigott from vw_planos e  \n\r'+
                'left outer join poste p on e.n_idpl_estructura = p.n_idpl_estructura \n\r'+
                'left outer join ri_a  on e.n_idpl_estructura = ri_a.n_idpl_estructura \n\r'+
                'left outer join Amortiguador_35 a35 on e.n_idpl_estructura = a35.n_idpl_estructura \n\r'+
                'left outer join Amortiguador_70 a37 on e.n_idpl_estructura = a37.n_idpl_estructura \n\r'+
                'left outer join rv_a  on e.n_idpl_estructura = rv_a.n_idpl_estructura \n\r'+
                'left outer join RI_MT  on e.n_idpl_estructura = RI_MT.n_idpl_estructura \n\r'+
                'left outer join RV_MT on e.n_idpl_estructura = RV_MT.n_idpl_estructura \n\r'+
                'left outer join RI  on e.n_idpl_estructura = RI.n_idpl_estructura \n\r'+
                'left outer join RV  on e.n_idpl_estructura = RV.n_idpl_estructura \n\r'+
                'left outer join RIY  on e.n_idpl_estructura = RIY.n_idpl_estructura \n\r'+
                'left outer join RVY  on e.n_idpl_estructura = RVY.n_idpl_estructura \n\r'+
                'left outer join PAT_1  on e.n_idpl_estructura = PAT_1.n_idpl_estructura \n\r'+
                'left outer join PAT_1C  on e.n_idpl_estructura = PAT_1c.n_idpl_estructura \n\r'+
                'left outer join PAT_2  on e.n_idpl_estructura = PAT_2.n_idpl_estructura \n\r'+
                'left outer join PAT_3  on e.n_idpl_estructura = PAT_3.n_idpl_estructura \n\r'+
                'left outer join PAT_1CS  on e.n_idpl_estructura = PAT_1CS.n_idpl_estructura \n\r'+
                'left outer join PAT_2S  on e.n_idpl_estructura = PAT_2S.n_idpl_estructura  \n\r'+
                'left outer join PAT_3S  on e.n_idpl_estructura = PAT_3S.n_idpl_estructura  \n\r'+
                'left outer join PAT_1S  on e.n_idpl_estructura = PAT_1S.n_idpl_estructura \n\r'+
                'left outer join AP_BT  on e.n_idpl_estructura = AP_BT.n_idpl_estructura \n\r'+
                'left outer join AP_MT  on e.n_idpl_estructura = AP_MT.n_idpl_estructura \n\r'+
                'left outer join tipo_trans tt on e.n_idpl_estructura = tt.n_idpl_estructura \n\r'+
                'left outer join estruct_anterior ea  on e.n_idpl_estructura = ea.n_idpl_estructurafin \n\r'+
                'inner join linea l on e.n_idpl_estructura = l.n_idpl_estructura \n\r'+    
                'where e.n_idpro_proyecto = $1 and e.n_version = $2 and e.n_idpl_zona = $3 and e.n_idpl_tipolinea = $4 and e.n_idpl_linea = $5 \n\r'+
                'order by p.n_idpl_estructura asc, l.n_idpl_estructuraarmado asc \n\r';
                pool.query(cadena,[request.body.n_idpro_proyecto, request.body.idversion, request.body.idzona, request.body.idtipolinea, request.body.idlinea],(error, results)=>{
                    if(error){
                        console.log(error)
                        response.status(200).json({ estado: false, mensaje: "DB: error al traer los datos2!.", data: null })   
                    }else{
                        var datos = results.rows;                        
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