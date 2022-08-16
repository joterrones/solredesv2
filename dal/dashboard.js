const { result } = require('lodash');
const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const getLineas = (request, response) => {
    
    var obj = valida.validaToken(request)
    if(obj.estado){
       let n_idpro_proyecto = request.body.n_idpro_proyecto;
        pool.query('select  pl.c_codigo, count(ple.c_nombre) as n_cantidad from pl_linea as pl '+
        'inner join  pl_estructura ple on ple.n_idpl_linea = pl.n_idpl_linea and ple.n_borrado = 0'+
        'inner join pl_zona pz on pz.n_idpl_zona = pl.n_idpl_zona and pz.n_borrado = 0'+
        'where  pz.n_idpro_proyecto = $1 and pl.n_borrado = 0 '+        
        'group by pl.c_codigo',
        [n_idpro_proyecto],
        (error, results) => {
            if (error) {
                console.log(error);
                response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas1" + error.stack, data: null })
            } else {
                let lineas = [];
                let cantidadesdeestructuras = [];
                let datos = results.rows;
                datos.forEach(element => {
                    lineas.push(element.c_codigo);
                    cantidadesdeestructuras.push(parseInt(element.n_cantidad));
                });

                pool.query('select  plz.c_nombre, count(pl.c_codigo) as n_cantidad from pl_zona as plz '+
                'inner join  pl_linea pl on pl.n_idpl_zona = plz.n_idpl_zona '+
                'where plz.n_borrado = 0 and pl.n_borrado = 0 and plz.n_idpro_proyecto = $1 '+
                'group by plz.c_nombre',
                [n_idpro_proyecto],
                (error, results) => {
                    if(error){
                        console.log(error);
                        response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas2" + error.stack, data: null })
                    } else{
                        let zonas = [];
                        let cantidadesdelineas = [];
                        let datos = results.rows;
                        datos.forEach(element => {
                            zonas.push(element.c_nombre);
                            cantidadesdelineas.push(parseInt(element.n_cantidad));
                        });
                        
                        pool.query('select  pl.c_codigo, count(mon.n_idpl_linea) as n_cantidad from pl_linea as pl '+
                        'inner join mon_inspeccion mon on mon.n_idpl_linea = pl.n_idpl_linea '+
                        'inner join pl_zona pz on pz.n_idpl_zona = pl.n_idpl_zona  '+
                        'where pl.n_borrado = 0 and mon.n_borrado = 0 and pz.n_idpro_proyecto = $1 '+
                        'group by pl.c_codigo',[n_idpro_proyecto],
                        (error, results) =>{
                            if(error){
                                console.log(error);
                                response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas3" + error.stack, data: null })
                            }else{
                                let cantidades_de_mon = [];
                                let datos = results.rows;
                                datos.forEach(element => {                                    
                                    cantidades_de_mon.push(parseInt(element.n_cantidad));
                                });
                                let formato="YYYY-TMMonth";
                                pool.query('select to_char(d_fechacrea, \' '+ formato +'\') as fecha, count(d_fechacrea) as cantidad from mon_inspeccion  '+                               
                                'group by fecha order by fecha asc',
                                (error, results) =>{
                                    if(error){
                                        console.log(error);
                                        response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas4" + error.stack, data: null })
                                    }else{

                                        let fechas = [];
                                        let cantidadesregistro = [];
                                        let datos = results.rows;
                                        datos.forEach(element => {
                                            fechas.push(element.fecha);
                                            cantidadesregistro.push(parseInt(element.cantidad));
                                        });

                                        pool.query('select zn.c_nombre as nombrezona, count(mon.n_idpl_linea) as cantidad from mon_inspeccion as mon '+
                                        'inner join pl_linea pl on pl.n_idpl_linea = mon.n_idpl_linea and pl.n_borrado = 0 '+
                                        'inner join pl_zona zn on zn.n_idpl_zona = pl.n_idpl_zona and zn.n_borrado = 0  '+
                                        'where zn.n_idpro_proyecto = $1 '+
                                        'group by zn.c_nombre',[request.body.n_idpro_proyecto],
                                        (error, result)=>{
                                            if(error){
                                                console.log(error);
                                                response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas5" + error.stack, data: null })
                                            }else{

                                                let nomZona = [];
                                                let cantidadZona = [];

                                                let datos = result.rows
                                                
                                                datos.forEach(element => {
                                                    nomZona.push(element.nombrezona);
                                                    cantidadZona.push(parseInt(element.cantidad));
                                                });

                                                let cadena = 'with expediente as ( '+
                                                                'select tl.n_idpl_tipolinea, tl.c_nombre, count(l.b_expediente)as expediente from pl_tipolinea tl '+
                                                                'inner join pl_linea l on tl.n_idpl_tipolinea = l.n_idpl_tipolinea and l.n_borrado = 0 and l.b_expediente is true '+
                                                                'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 and z.n_idpro_proyecto = '+n_idpro_proyecto+'  '+
                                                                'where tl.n_borrado = 0  '+
                                                                'group by  tl.n_idpl_tipolinea, tl.c_nombre '+
                                                            '), '+
                                                            'replanteo as ( '+
                                                                'select tl.n_idpl_tipolinea, tl.c_nombre, count(l.b_replanteo)as replanteo from pl_tipolinea tl '+
                                                                'inner join pl_linea l on tl.n_idpl_tipolinea = l.n_idpl_tipolinea and l.n_borrado = 0 and l.b_replanteo is true '+
                                                                'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 and z.n_idpro_proyecto = '+n_idpro_proyecto+'  '+
                                                                'where tl.n_borrado = 0  '+
                                                                'group by  tl.n_idpl_tipolinea, tl.c_nombre '+
                                                            '), '+
                                                            'montaje as ( '+
                                                                'select tl.n_idpl_tipolinea, tl.c_nombre, count(l.b_montaje)as montaje from pl_tipolinea tl '+
                                                                'inner join pl_linea l on tl.n_idpl_tipolinea = l.n_idpl_tipolinea and l.n_borrado = 0 and l.b_montaje is true '+
                                                                'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 and z.n_idpro_proyecto = '+n_idpro_proyecto+'  '+
                                                                'where tl.n_borrado = 0  '+
                                                                'group by  tl.n_idpl_tipolinea, tl.c_nombre '+
                                                            '), '+
                                                            'cierre as ( '+
                                                                'select tl.n_idpl_tipolinea, tl.c_nombre, count(l.b_cierre)as cierre from pl_tipolinea tl '+
                                                                'inner join pl_linea l on tl.n_idpl_tipolinea = l.n_idpl_tipolinea and l.n_borrado = 0 and l.b_cierre is true '+
                                                                'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 and z.n_idpro_proyecto = '+n_idpro_proyecto+'  '+
                                                                'where tl.n_borrado = 0  '+
                                                                'group by  tl.n_idpl_tipolinea, tl.c_nombre '+
                                                            ') '+
                                                            'select tl.n_idpl_tipolinea, tl.c_nombre, count(l.n_idpl_tipolinea)as total, e.expediente, r.replanteo, m.montaje, c.cierre,z.n_idpro_proyecto from pl_tipolinea tl '+
                                                                'inner join pl_linea l on tl.n_idpl_tipolinea = l.n_idpl_tipolinea and l.n_borrado = 0 '+
                                                                'left join expediente e on tl.n_idpl_tipolinea = e.n_idpl_tipolinea '+
                                                                'left join replanteo r on tl.n_idpl_tipolinea = r.n_idpl_tipolinea '+
                                                                'left join montaje m on tl.n_idpl_tipolinea = m.n_idpl_tipolinea '+
                                                                'left join cierre c on tl.n_idpl_tipolinea = c.n_idpl_tipolinea '+
                                                                'inner join pl_zona z on l.n_idpl_zona = z.n_idpl_zona and z.n_borrado = 0 and z.n_idpro_proyecto = '+n_idpro_proyecto+' '+
                                                                'where tl.n_borrado = 0 '+
                                                                'group by  tl.n_idpl_tipolinea, tl.c_nombre, e.expediente, r.replanteo, m.montaje, c.cierre, z.n_idpro_proyecto ';
                                                
                                                pool.query( cadena , (error, results) =>{
                                                    if(error){
                                                        console.log(error);
                                                        response.status(200).json({ estado: false, mensaje: "DB: error datos. getLineas6" + error.stack, data: null })
                                                    }else{

                                                        let array = results.rows;

                                                        let tplinea = [];
                                                        let total = [];
                                                        let expediente = [];
                                                        let replanteo = [];
                                                        let montaje = [];
                                                        let cierre = [];

                                                        array.forEach(element => {
                                                            if(element.n_idpro_proyecto){
                                                                tplinea.push(element.c_nombre)
                                                                total.push(element.total)
                                                                expediente.push(element.expediente)
                                                                replanteo.push(element.replanteo)
                                                                montaje.push(element.montaje)
                                                                cierre.push(element.cierre)
                                                            }
                                                        });

                                                        response.status(200).json({                            
                                                            estado: true, mensaje: "", data: {
                                                                graficolineas: { claves: lineas, cantidades: cantidadesdeestructuras, cantidadesmon:cantidades_de_mon},
                                                                graficozonas: { claves: zonas, cantidades: cantidadesdelineas},
                                                                graficoperiodo: { claves: fechas, cantidades: cantidadesregistro},
                                                                graficozon: { claves: nomZona, cantidades: cantidadZona},
                                                                graficoLineaEstado: { datos: array, tplinea: tplinea, total: total, expediente: expediente, replanteo: replanteo, montaje: montaje, cierre: cierre}
                                                            }
                                                        })
                                                    }
                                                })
                                                
                                                
                                            }
                                        })
                                    }
                                })
                            }
                        })                        
                    }
                });                
            }
        });
    }
    else {
        response.status(200).json(obj)
    }
}

const getDepartamento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
        let n_idgen_fase = request.body.n_idgen_fase;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;
        pool.query('with base as ( ' +
            'Select  p.n_idgen_fase,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado ' +
            'from ' + (n_idgen_fase == 4 ? 'vw_proyecto_supervision' : 'vw_proyecto') + ' p ' +
            'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
            'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
            'where p.n_borrado = 0 ' +
            '), fin as ( ' +
            'select distinct c_departamento,n_idgen_proyecto from base ' +
            'where (n_idgen_departamento = $1 or 0 = $1) ' +
            'and (n_idgen_provincia = $2 or 0 = $2) ' +
            'and (n_idgen_distrito = $3 or 0 = $3) ' +
            'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
            'and (n_idgen_fase = $5 or 0 = $5) ' +
            'and (n_idgen_proyecto = $6 or 0 = $6) ' +
            ') select distinct c_departamento,count(n_idgen_proyecto) n_cantidad from fin group by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error datos!." + error.stack, data: null })
                } else {

                    let departamentos = [];
                    let cantidadesdepartamentos = [];
                    let datos = results.rows;
                    datos.forEach(element => {
                        departamentos.push(element.c_departamento);
                        cantidadesdepartamentos.push(parseInt(element.n_cantidad));
                    });
                    pool.query('select l.c_valorlista, count(p.n_idgen_proyecto)n_cantidad from gen_lista l ' +
                        'inner join gen_proyecto p on l.n_idgen_lista = p.n_id_tipoejecucion and p.n_borrado = 0 ' +
                        'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                        'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                        'where l.n_borrado = 0 and l.n_idgen_grupolista = 4 ' +

                        'group by l.c_valorlista',
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error datostipos!." + error.stack, data: null })
                            } else {

                                let tipoejecuciones = [];
                                let cantidadestipos = [];

                                let datostipos = results.rows;


                                datostipos.forEach(element => {
                                    tipoejecuciones.push(element.c_valorlista);
                                    cantidadestipos.push(parseInt(element.n_cantidad));
                                });
                                pool.query('with base as ( ' +
                                    'Select  p.n_idgen_fase, p.c_fase c_nombre,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado ' +
                                    'from ' + (n_idgen_fase == 4 ? 'vw_proyecto_supervision' : 'vw_proyecto') + ' p ' +
                                    'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                    'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                    'where p.n_borrado = 0 ' +
                                    '), fin as ( ' +
                                    'select distinct n_idgen_fase, c_nombre, n_idgen_proyecto from base ' +
                                    'where (n_idgen_departamento = $1 or 0 = $1) ' +
                                    'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                    'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                    'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                    'and (n_idgen_fase = $5 or 0 = $5) ' +
                                    'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                    ') select c_nombre, count(n_idgen_proyecto) n_cantidad from fin group by c_nombre, n_idgen_fase order by n_idgen_fase', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                    (error, results) => {
                                        if (error) {
                                            response.status(200).json({ estado: false, mensaje: "DB: error datosfase!." + error.stack, data: null })
                                        } else {

                                            let fases = [];
                                            let cantidadfases = [];

                                            let datosfases = results.rows;


                                            datosfases.forEach(element => {
                                                fases.push(element.c_nombre);
                                                cantidadfases.push(parseInt(element.n_cantidad));
                                            });

                                            pool.query(
                                                'with base as ( \n\r' +
                                                'select \n\r' +
                                                '    p.n_idgen_fase, p.n_valor, p.c_atributo, u.c_departamento, \n\r' +
                                                '    p.n_idgen_proyecto, u.n_idgen_departamento, u.n_idgen_provincia, u.n_idgen_distrito, u.n_idgen_centropoblado \n\r' +
                                                'from  \n\r' +
                                                '    vw_dashboard_monto p  \n\r' +
                                                'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0  \n\r' +
                                                'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado  \n\r' +
                                                'where  \n\r' +
                                                '    p.n_borrado = 0 \n\r' +
                                                '    and trim(p.c_atributo) in (\'Inversión Incluye IGV\',\'Valor Referencial incl. IGV\',\'Costo Obra incl. IGV\',\'Costo Consultoria incl. IGV\',\'Costo Conforme a Obra Inc. IGV\') \n\r' +
                                                '), fin as (  \n\r' +
                                                'select distinct n_idgen_fase, n_valor from base  \n\r' +
                                                'where  \n\r' +
                                                '    (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1)  \n\r' +
                                                '    and (n_idgen_provincia = $2 or 0 = $2)  \n\r' +
                                                '    and (n_idgen_distrito = $3 or 0 = $3)  \n\r' +
                                                '    and (n_idgen_centropoblado = $4 or 0 = $4)  \n\r' +
                                                '    and (n_idgen_fase = $5 or 0 = $5)  \n\r' +
                                                '    and (n_idgen_proyecto = $6 or 0 = $6) \n\r' +
                                                ') select p.n_idgen_fase, f.c_nombre, sum(p.n_valor) n_cantidad from fin p \n\r' +
                                                'inner join gen_fase f on p.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 \n\r' +
                                                'group by p.n_idgen_fase, f.c_nombre order by p.n_idgen_fase'
                                                /*'with base as ( ' +
                                                'Select  p.n_idgen_fase, p.c_fase c_nombre, p.n_monto,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_proyecto_monto p ' +
                                                'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                'where p.n_borrado = 0 ' +
                                                '), fin as ( ' +
                                                'select distinct c_nombre,n_monto from base ' +
                                                'where (n_idgen_departamento = $1 or 0 = $1) ' +
                                                'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                ') select  c_nombre,sum(n_monto) n_cantidad from fin group by c_nombre'*/
                                                , [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                (error, results) => {
                                                    if (error) {
                                                        response.status(200).json({ estado: false, mensaje: "DB: error datosfasesmonto!." + error.stack, data: null })
                                                    } else {

                                                        let fasesmonto = [];
                                                        let cantidadfasesmonto = [];

                                                        let datosfasesmonto = results.rows;

                                                        datosfasesmonto.forEach(element => {
                                                            fasesmonto.push(element.c_nombre);
                                                            cantidadfasesmonto.push(parseFloat(element.n_cantidad));
                                                        });

                                                        pool.query('with base as ( ' +
                                                            'Select  p.n_idgen_fase, p.c_fase c_nombre, p.n_monto,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado ' +
                                                            'from ' + (n_idgen_fase == 4 ? 'vw_proyecto_montovalorizado_supervision' : 'vw_proyecto_montovalorizado') + ' p ' +
                                                            'left outer join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                            'left outer join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                            'where p.n_borrado = 0 ' +
                                                            '), fin as ( ' +
                                                            'select distinct n_idgen_fase,n_idgen_proyecto,c_nombre,n_monto from base ' +
                                                            'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                            'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                            'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                            'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                            'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                            'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                            ') select  n_idgen_fase,c_nombre,sum(n_monto) n_cantidad from fin group by n_idgen_fase,c_nombre order by n_idgen_fase', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                            (error, results) => {
                                                                if (error) {
                                                                    response.status(200).json({ estado: false, mensaje: "DB: error datosfasesmontovalorizado!." + error.stack, data: null })
                                                                } else {

                                                                    let fasesmontovalorizado = [];
                                                                    let cantidadfasesmontovalorizado = [];

                                                                    let datosfasesmontovalorizado = results.rows;

                                                                    datosfasesmontovalorizado.forEach(element => {
                                                                        fasesmontovalorizado.push(element.c_nombre);
                                                                        cantidadfasesmontovalorizado.push(parseFloat(element.n_cantidad));
                                                                    });

                                                                    pool.query('with base as ( ' +
                                                                        'Select  p.n_idgen_fase,p.n_valor, p.c_atributo ,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_dashboard_linea p ' +
                                                                        'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                        'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                        'where p.n_borrado = 0 ' +
                                                                        'and p.c_atributo = \'LP\' ' +
                                                                        '), fin as ( ' +
                                                                        'select distinct COALESCE(c_departamento, \'-Sin Ubigeo-\') c_departamento,n_valor from base ' +
                                                                        'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                        'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                        'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                        'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                        'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                        'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                        ') select  c_departamento,sum(n_valor) n_cantidad from fin group by c_departamento order by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                        (error, results) => {
                                                                            if (error) {
                                                                                response.status(200).json({ estado: false, mensaje: "DB: error lp!." + error.stack, data: null })
                                                                            } else {

                                                                                let lineas = [];
                                                                                let cantidadlineas = [];

                                                                                let datoslineas = results.rows;

                                                                                datoslineas.forEach(element => {
                                                                                    lineas.push(element.c_departamento);
                                                                                    cantidadlineas.push(parseFloat(element.n_cantidad));
                                                                                });

                                                                                pool.query('with base as ( ' +
                                                                                    'Select  p.n_idgen_fase,p.n_valor, p.c_atributo ,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_dashboard_linea p ' +
                                                                                    'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                                    'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                                    'where p.n_borrado = 0 ' +
                                                                                    'and p.c_atributo = \'RP\' ' +
                                                                                    '), fin as ( ' +
                                                                                    'select distinct COALESCE(c_departamento, \'-Sin Ubigeo-\') c_departamento,n_valor from base ' +
                                                                                    'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                                    'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                                    'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                                    'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                                    'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                                    'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                                    ') select  c_departamento,sum(n_valor) n_cantidad from fin group by c_departamento order by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                                    (error, results) => {
                                                                                        if (error) {
                                                                                            response.status(200).json({ estado: false, mensaje: "DB: error rp!." + error.stack, data: null })
                                                                                        } else {

                                                                                            let lineasrp = [];
                                                                                            let cantidadlineasrp = [];

                                                                                            let datoslineasrp = results.rows;

                                                                                            datoslineasrp.forEach(element => {
                                                                                                lineasrp.push(element.c_departamento);
                                                                                                cantidadlineasrp.push(parseFloat(element.n_cantidad));
                                                                                            });

                                                                                            pool.query('with base as ( ' +
                                                                                                'Select  p.n_idgen_fase,p.n_valor, p.c_atributo ,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_dashboard_linea p ' +
                                                                                                'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                                                'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                                                'where p.n_borrado = 0 ' +
                                                                                                'and p.c_atributo = \'RS\' ' +
                                                                                                '), fin as ( ' +
                                                                                                'select distinct COALESCE(c_departamento, \'-Sin Ubigeo-\') c_departamento,n_valor from base ' +
                                                                                                'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                                                'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                                                'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                                                'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                                                'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                                                'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                                                ') select  c_departamento,sum(n_valor) n_cantidad from fin group by c_departamento order by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                                                (error, results) => {
                                                                                                    if (error) {
                                                                                                        response.status(200).json({ estado: false, mensaje: "DB: error rs!." + error.stack, data: null })
                                                                                                    } else {

                                                                                                        let lineasrs = [];
                                                                                                        let cantidadlineasrs = [];

                                                                                                        let datoslineasrs = results.rows;

                                                                                                        datoslineasrs.forEach(element => {
                                                                                                            lineasrs.push(element.c_departamento);
                                                                                                            cantidadlineasrs.push(parseFloat(element.n_cantidad));
                                                                                                        });

                                                                                                        pool.query('with base as ( ' +
                                                                                                            'Select  p.n_idgen_fase,p.n_valor, p.c_atributo ,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_dashboard_luminaria p ' +
                                                                                                            'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                                                            'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                                                            'where p.n_borrado = 0 ' +
                                                                                                            '), fin as ( ' +
                                                                                                            'select distinct COALESCE(c_departamento, \'-Sin Ubigeo-\') c_departamento,n_valor from base ' +
                                                                                                            'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                                                            'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                                                            'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                                                            'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                                                            'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                                                            'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                                                            ') select  c_departamento,sum(n_valor) n_cantidad from fin group by c_departamento order by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                                                            (error, results) => {
                                                                                                                if (error) {
                                                                                                                    response.status(200).json({ estado: false, mensaje: "DB: error datoslineaslum!." + error.stack, data: null })
                                                                                                                } else {

                                                                                                                    let lineaslum = [];
                                                                                                                    let cantidadlineaslum = [];

                                                                                                                    let datoslineaslum = results.rows;

                                                                                                                    datoslineaslum.forEach(element => {
                                                                                                                        lineaslum.push(element.c_departamento);
                                                                                                                        cantidadlineaslum.push(parseFloat(element.n_cantidad));
                                                                                                                    });

                                                                                                                    pool.query('with base as ( ' +
                                                                                                                        'Select  p.n_idgen_fase,p.n_valor, p.c_atributo ,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado from vw_dashboard_linea p ' +
                                                                                                                        'left join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                                                                        'left join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                                                                        'where p.n_borrado = 0 ' +
                                                                                                                        'and p.c_atributo = \'LP Reforzamiento\' ' +
                                                                                                                        '), fin as ( ' +
                                                                                                                        'select distinct COALESCE(c_departamento, \'-Sin Ubigeo-\') c_departamento,n_valor from base ' +
                                                                                                                        'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                                                                        'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                                                                        'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                                                                        'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                                                                        'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                                                                        'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                                                                        ') select  c_departamento,sum(n_valor) n_cantidad from fin group by c_departamento order by c_departamento', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                                                                        (error, results) => {
                                                                                                                            if (error) {
                                                                                                                                response.status(200).json({ estado: false, mensaje: "DB: error datoslineaslum!." + error.stack, data: null })
                                                                                                                            } else {

                                                                                                                                let lineaspref = [];
                                                                                                                                let cantidadlineaspref = [];

                                                                                                                                let datoslineaspref = results.rows;

                                                                                                                                datoslineaspref.forEach(element => {
                                                                                                                                    lineaspref.push(element.c_departamento);
                                                                                                                                    cantidadlineaspref.push(parseFloat(element.n_cantidad));
                                                                                                                                });

                                                                                                                                /*response.status(200).json({
                                                                                                                                    estado: true, mensaje: "", data: {
                                                                                                                                        graficodepartamento: { claves: departamentos, cantidades: cantidadesdepartamentos },
                                                                                                                                        graficotipoejecucion: { claves: tipoejecuciones, cantidades: cantidadestipos },
                                                                                                                                        graficofase: { claves: fases, cantidades: cantidadfases },
                                                                                                                                        graficofasemonto: { claves: fasesmonto, cantidades: cantidadfasesmonto },
                                                                                                                                        graficofasemontovalorizado: { claves: fasesmontovalorizado, cantidades: cantidadfasesmontovalorizado },
                                                                                                                                        graficolinea: { claves: lineas, cantidades: cantidadlineas },
                                                                                                                                        graficolinearp: { claves: lineasrp, cantidades: cantidadlineasrp },
                                                                                                                                        graficolinears: { claves: lineasrs, cantidades: cantidadlineasrs },
                                                                                                                                        graficoluminaria: { claves: lineaslum, cantidades: cantidadlineaslum },
                                                                                                                                        graficolpreforzamiento: { claves: lineaspref, cantidades: cantidadlineaspref },
                                                                                                                                    }
                                                                                                                                })*/

                                                                                                                                pool.query('with base as ( ' +
                                                                                                                                    'Select  p.n_idgen_fase, p.c_fase c_nombre, p.n_monto,u.c_departamento,p.n_idgen_proyecto,u.n_idgen_departamento,u.n_idgen_provincia,u.n_idgen_distrito, u.n_idgen_centropoblado ' +
                                                                                                                                    'from ' + (n_idgen_fase == 4 ? 'vw_proyecto_monto_supervision' : 'vw_proyecto_monto') + ' p ' +
                                                                                                                                    'left outer join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                                                                                                                    'left outer join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado ' +
                                                                                                                                    'where p.n_borrado = 0 ' +
                                                                                                                                    '), fin as ( ' +
                                                                                                                                    'select distinct n_idgen_fase,n_idgen_proyecto,c_nombre,n_monto from base ' +
                                                                                                                                    'where (coalesce(n_idgen_departamento, -100) = $1 or 0 = $1) ' +
                                                                                                                                    'and (n_idgen_provincia = $2 or 0 = $2) ' +
                                                                                                                                    'and (n_idgen_distrito = $3 or 0 = $3) ' +
                                                                                                                                    'and (n_idgen_centropoblado = $4 or 0 = $4) ' +
                                                                                                                                    'and (n_idgen_fase = $5 or 0 = $5) ' +
                                                                                                                                    'and (n_idgen_proyecto = $6 or 0 = $6) ' +
                                                                                                                                    ') select n_idgen_fase,c_nombre,sum(n_monto) n_cantidad from fin group by n_idgen_fase,c_nombre order by n_idgen_fase', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase, n_idgen_proyecto],
                                                                                                                                    (error, results) => {
                                                                                                                                        if (error) {
                                                                                                                                            response.status(200).json({ estado: false, mensaje: "DB: error datoslineaslum!." + error.stack, data: null })
                                                                                                                                        } else {

                                                                                                                                            let fasesmontocontratado = [];
                                                                                                                                            let cantidadfasesmontocontratado = [];

                                                                                                                                            let datosfasesmontocontratado = results.rows;

                                                                                                                                            datosfasesmontocontratado.forEach(element => {
                                                                                                                                                fasesmontocontratado.push(element.c_nombre);
                                                                                                                                                cantidadfasesmontocontratado.push(parseFloat(element.n_cantidad));
                                                                                                                                            });

                                                                                                                                            response.status(200).json({
                                                                                                                                                estado: true, mensaje: "", data: {
                                                                                                                                                    graficodepartamento: { claves: departamentos, cantidades: cantidadesdepartamentos },
                                                                                                                                                    graficotipoejecucion: { claves: tipoejecuciones, cantidades: cantidadestipos },
                                                                                                                                                    graficofase: { claves: fases, cantidades: cantidadfases },
                                                                                                                                                    graficofasemonto: { claves: fasesmonto, cantidades: cantidadfasesmonto },
                                                                                                                                                    graficofasemontovalorizado: { claves: fasesmontocontratado, cantidades: { cantidadfasesmontovalorizado, cantidadfasesmontocontratado } },
                                                                                                                                                    graficolinea: { claves: lineas, cantidades: cantidadlineas },
                                                                                                                                                    graficolinearp: { claves: lineasrp, cantidades: cantidadlineasrp },
                                                                                                                                                    graficolinears: { claves: lineasrs, cantidades: cantidadlineasrs },
                                                                                                                                                    graficoluminaria: { claves: lineaslum, cantidades: cantidadlineaslum },
                                                                                                                                                    graficolpreforzamiento: { claves: lineaspref, cantidades: cantidadlineaspref },
                                                                                                                                                }
                                                                                                                                            })
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                            }
                                                                                                                        })
                                                                                                                }
                                                                                                            })
                                                                                                    }
                                                                                                })
                                                                                        }
                                                                                    })
                                                                            }
                                                                        })
                                                                }
                                                            })
                                                    }
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

const getcantidad = (request, response) => {
    let proyectos = [];
    let centropoblados = [];
    let tipoejecuciones = [];
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
        let n_idgen_fase = request.body.n_idgen_fase;

        pool.query('with base as ( ' +
            'select p.n_idgen_proyecto  from gen_proyecto p ' +
            'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
            'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado  ' +
            'where p.n_borrado = 0 ' +
            'and (u.n_idgen_departamento = $1 or 0 = $1) ' +
            'and (u.n_idgen_provincia = $2 or 0 = $2) ' +
            'and (u.n_idgen_distrito = $3 or 0 = $3) ' +
            'and (u.n_idgen_centropoblado = $4 or 0 = $4) ' +
            'and (cp.n_idgen_fase = $5 or 0 = $5) ' +
            'group by p.n_idgen_proyecto) ' +
            'select count(n_idgen_proyecto)n_cantidad from base '
            , [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                } else {
                    proyectos = results.rows;
                    pool.query('with base as ( ' +
                        'select  ' +
                        'cpp.n_idgen_proyecto,cpp.n_idgen_centropoblado, f.c_nombre ' +
                        'from pro_cpproyecto cpp ' +
                        'inner join gen_fase f on cpp.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 ' +
                        'inner join  vw_ubigeo u on cpp.n_idgen_centropoblado = u.n_idgen_centropoblado  ' +
                        'where cpp.n_borrado = 0 ' +
                        'and (u.n_idgen_departamento = $1 or 0 = $1) ' +
                        'and (u.n_idgen_provincia = $2 or 0 = $2) ' +
                        'and (u.n_idgen_distrito = $3 or 0 = $3) ' +
                        'and (u.n_idgen_centropoblado = $4 or 0 = $4) ' +
                        'and (f.n_idgen_fase = $5 or 0 = $5) ' +
                        'group by cpp.n_idgen_proyecto,cpp.n_idgen_centropoblado,f.c_nombre ' +
                        ')  ' +
                        'select  ' +
                        'count(n_idgen_centropoblado) n_cantidad , c_nombre ' +
                        'from base ' +
                        'group by c_nombre'
                        , [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                            } else {
                                centropoblados = results.rows;
                                pool.query('with base as ( ' +
                                    'select p.n_idgen_proyecto, p.n_nrousuarios, p.n_nroviviendas from gen_proyecto p  ' +
                                    'inner join pro_cpproyecto cp on p.n_idgen_proyecto = cp.n_idgen_proyecto and cp.n_borrado = 0 ' +
                                    'inner join vw_ubigeo u on cp.n_idgen_centropoblado = u.n_idgen_centropoblado  ' +
                                    'where (u.n_idgen_departamento = $1 or 0 = $1) ' +
                                    'and (u.n_idgen_provincia = $2 or 0 = $2) ' +
                                    'and (u.n_idgen_distrito = $3 or 0 = $3) ' +
                                    'and (u.n_idgen_centropoblado = $4 or 0 = $4) ' +
                                    'and (cp.n_idgen_fase = $5 or 0 = $5) ' +
                                    'group by p.n_idgen_proyecto, p.n_nrousuarios) ' +
                                    'select sum(n_nrousuarios) n_cantidad,sum(n_nroviviendas) n_viviendas from base  ', [n_idgen_departamento, n_idgen_provincia, n_idgen_distrito, n_idgen_centropoblado, n_idgen_fase],
                                    (error, results) => {
                                        if (error) {
                                            response.status(200).json({ estado: false, mensaje: "DB: error!.", data: null })
                                        } else {
                                            tipoejecuciones = results.rows;
                                            response.status(200).json({ estado: true, mensaje: "", data: { proyectos: proyectos, centropoblados: centropoblados, tipoejecuciones: tipoejecuciones } })
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


const gettotales = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_fase = request.body.n_idgen_fase;
        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_proyecto = request.body.n_idgen_proyecto;

        pool.query(
            '    ;with	consulta as \n\r' +
            '    ( \n\r' +
            '        select \n\r' +
            '            row_number() over(partition by tp.n_idgen_proyecto order by tp.n_idgen_fase desc) ordenfase, \n\r' +
            '            tp.n_idgen_fase, \n\r' +
            '            tp.n_idgen_proyecto \n\r' +
            '        from  \n\r' +
            '            ' + (n_idgen_fase == 4 ? 'vw_proyecto_supervision' : 'vw_proyecto') + ' tp \n\r' +
            '            left outer join vw_proyecto_ubigeo u on u.n_idgen_proyecto = tp.n_idgen_proyecto --and u.n_idgen_fase = tp.n_idgen_fase \n\r' +
            '            where \n\r' +
            '                (tp.n_idgen_fase = ' + n_idgen_fase + ' or ' + n_idgen_fase + ' = 0) \n\r' +
            '                and (tp.n_idgen_proyecto = ' + n_idgen_proyecto + ' or ' + n_idgen_proyecto + ' = 0) \n\r' +
            '                and (coalesce(u.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
            //'                and (u.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
            //'                and (u.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
            '    ) \n\r' +
            '    ,	consulta1 as \n\r' +
            '    ( \n\r' +
            '        select  \n\r' +
            '            1 orden, \n\r' +
            '            count(n_idgen_proyecto) :: int totproyectos, \n\r' +
            '            coalesce(sum(case when coalesce(n_idgen_fase, 0) = 0 then 1 else 0 end), 0) :: int fase0, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 1 then 1 else 0 end), 0) :: int fase1, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 2 then 1 else 0 end), 0) :: int fase2, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 3 then 1 else 0 end), 0) :: int fase3, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 4 then 1 else 0 end), 0) :: int fase4, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 5 then 1 else 0 end), 0) :: int fase5 \n\r' +
            '        from \n\r' +
            '            consulta \n\r' +
            '        where \n\r' +
            '            ordenfase = 1 \n\r' +
            '    ) \n\r' +
            '    ,	consulta2 as \n\r' +
            '    ( \n\r' +
            '        select  \n\r' +
            '            row_number() over(partition by tp.n_idgen_proyecto order by tp.n_idgen_fase desc) ordenfase, \n\r' +
            '            tp.n_idgen_fase, \n\r' +
            '            tp.n_idgen_proyecto \n\r' +
            '        from  \n\r' +
            '            ' + (n_idgen_fase == 4 ? 'vw_proyecto_supervision' : 'vw_proyecto') + ' tp \n\r' +
            '            inner join vw_proyecto_ubigeo u on u.n_idgen_proyecto = tp.n_idgen_proyecto --and u.n_idgen_fase = tp.n_idgen_fase \n\r' +
            '            where \n\r' +
            '                (tp.n_idgen_fase = ' + n_idgen_fase + ' or ' + n_idgen_fase + ' = 0) \n\r' +
            '                and (tp.n_idgen_proyecto = ' + n_idgen_proyecto + ' or ' + n_idgen_proyecto + ' = 0) \n\r' +
            '                and (coalesce(u.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
            //'                and (u.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
            //'                and (u.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
            '    ) \n\r' +
            '    ,	consulta3 as \n\r' +
            '    ( \n\r' +
            '        select  \n\r' +
            '            2 orden, \n\r' +
            '            count(n_idgen_proyecto) :: int totproyectos, \n\r' +
            '            coalesce(sum(case when coalesce(n_idgen_fase, 0) = 0 then 1 else 0 end), 0) :: int fase0, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 1 then 1 else 0 end), 0) :: int fase1, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 2 then 1 else 0 end), 0) :: int fase2, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 3 then 1 else 0 end), 0) :: int fase3, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 4 then 1 else 0 end), 0) :: int fase4, \n\r' +
            '            coalesce(sum(case when n_idgen_fase = 5 then 1 else 0 end), 0) :: int fase5 \n\r' +
            '        from \n\r' +
            '            consulta2 \n\r' +
            '        where \n\r' +
            '            ordenfase = 1 \n\r' +
            '    ) \n\r' +
            '    select * from consulta1 \n\r' +
            '    union \n\r' +
            '    select * from consulta3',
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!." + error.stack, data: null })
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getDashboardBolsa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_departamento = request.body.n_idgen_departamento;
        //let n_idgen_provincia = request.body.n_idgen_provincia;
        //let n_idgen_distrito = request.body.n_idgen_distrito;
        //let n_idgen_centropoblado = request.body.n_idgen_centropoblado;
        //let n_idgen_fase = request.body.n_idgen_fase;
        let n_annio = request.body.n_annio;

        pool.query(
            '   ;with	consulta as \n\r' +
            '   ( \n\r' +
            '       select \n\r' +
            '           distinct \n\r' +
            '           coalesce(u.c_departamento, \'-Sin Ubigeo-\') c_departamento, \n\r' +
            '           bp.n_idgen_bolsaproyecto, \n\r' +
            '           bp.c_estado \n\r' +
            '       from \n\r' +
            '           vw_bolsaproyecto bp \n\r' +
            '           left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
            '           left outer join	vw_ubigeodistrito u on u.n_idgen_distrito = bd.n_idgen_distrito \n\r' +
            '       where \n\r' +
            (n_annio != 0 ? ' (bp.n_annioprograma = $1 or 0 = $1) ' : ' bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1)') + ' \n\r' +
            //'           bp.orden = 1 \n\r' +
            //'           and (bp.n_annioprograma = $1 or 0 = $1) \n\r' +
            '           and (coalesce(u.n_idgen_departamento, -100) = $2 or 0 = $2) \n\r' +
            '   ) \n\r' +
            '   select \n\r' +
            '       c_departamento, \n\r' +
            '       count(n_idgen_bolsaproyecto) n_cantidad, \n\r' +
            '       sum(case when c_estado = \'EN CARTERA\' then 1 else 0 end) n_cartera, \n\r' +
            '       sum(case when c_estado = \'EN DESARROLLO\' then 1 else 0 end) n_desarrollo \n\r' +
            '   from \n\r' +
            '       consulta \n\r' +
            '   group by \n\r' +
            '       c_departamento \n\r' +
            '   order by \n\r' +
            '       c_departamento', [n_annio, n_idgen_departamento],
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error datos!." + error.stack, data: null })
                } else {
                    let departamentos = [];
                    let cantidaddepartamentos = [];
                    let cantidaddepartamentoscartera = [];
                    let cantidaddepartamentosdesarrollo = [];
                    let datos = results.rows;
                    datos.forEach(element => {
                        departamentos.push(element.c_departamento);
                        cantidaddepartamentos.push(parseInt(element.n_cantidad));
                        cantidaddepartamentoscartera.push(parseInt(element.n_cartera));
                        cantidaddepartamentosdesarrollo.push(parseInt(element.n_desarrollo));
                    });

                    pool.query(
                        '   ;with	consulta as \n\r' +
                        '   ( \n\r' +
                        '       select \n\r' +
                        '           distinct \n\r' +
                        '           bp.n_annioprograma, \n\r' +
                        '           bp.n_idgen_bolsaproyecto, \n\r' +
                        '           bp.c_estado \n\r' +
                        '       from \n\r' +
                        '           vw_bolsaproyecto bp \n\r' +
                        '           left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                        '           left outer join	vw_ubigeodistrito u on u.n_idgen_distrito = bd.n_idgen_distrito \n\r' +
                        '       where \n\r' +
                        (n_annio != 0 ? ' (bp.n_annioprograma = $1 or 0 = $1) ' : ' bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1)') + ' \n\r' +
                        //'           bp.orden = 1 \n\r' +
                        //'           and (bp.n_annioprograma = $1 or 0 = $1) \n\r' +
                        '           and (coalesce(u.n_idgen_departamento, -100) = $2 or 0 = $2) \n\r' +
                        '   ) \n\r' +
                        '   select \n\r' +
                        '       n_annioprograma, \n\r' +
                        '       count(n_idgen_bolsaproyecto) n_cantidad, \n\r' +
                        '       sum(case when c_estado = \'EN CARTERA\' then 1 else 0 end) n_cartera, \n\r' +
                        '       sum(case when c_estado = \'EN DESARROLLO\' then 1 else 0 end) n_desarrollo \n\r' +
                        '   from \n\r' +
                        '       consulta \n\r' +
                        '   group by \n\r' +
                        '       n_annioprograma \n\r' +
                        '   order by \n\r' +
                        '       n_annioprograma', [n_annio, n_idgen_departamento],
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error datosfase!." + error.stack, data: null })
                            } else {
                                let annios = [];
                                let cantidadannios = [];
                                let cantidadcartera = [];
                                let cantidaddesarrollo = [];
                                let datosannios = results.rows;
                                datosannios.forEach(element => {
                                    annios.push(element.n_annioprograma);
                                    cantidadannios.push(parseInt(element.n_cantidad));
                                    cantidadcartera.push(parseInt(element.n_cartera));
                                    cantidaddesarrollo.push(parseInt(element.n_desarrollo));
                                });

                                let cadena3 =
                                    '   ;with	consulta as \n\r' +
                                    '   ( \n\r' +
                                    '       select \n\r' +
                                    '           distinct \n\r' +
                                    '           bp.n_annioprograma, \n\r' +
                                    '           bp.n_idgen_bolsaproyecto, \n\r' +
                                    '           bp.n_montoprogramadoannio, \n\r' +
                                    '           bp.n_montoejecene + bp.n_montoejecfeb + bp.n_montoejecmar + bp.n_montoejecabr + bp.n_montoejecmay + bp.n_montoejecjun + bp.n_montoejecjul + bp.n_montoejecago + bp.n_montoejecset + bp.n_montoejecoct + bp.n_montoejecnov + bp.n_montoejecdic as n_montoejecutadoannio  \n\r' +
                                    '       from \n\r' +
                                    '           vw_bolsaproyecto bp \n\r' +
                                    '           left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                                    '           left outer join	vw_ubigeodistrito u on u.n_idgen_distrito = bd.n_idgen_distrito \n\r' +
                                    '       where \n\r' +
                                    (n_annio != 0 ? ' (bp.n_annioprograma = $1 or 0 = $1) ' : ' bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1)') + ' \n\r' +
                                    //'           bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1) \n\r' +
                                    '           and (coalesce(u.n_idgen_departamento, -100) = $2 or 0 = $2) \n\r' +
                                    '   ) \n\r' +
                                    '   select \n\r' +
                                    '       n_annioprograma, \n\r' +
                                    '       sum(n_montoprogramadoannio) n_montoprogramado, \n\r' +
                                    '       sum(n_montoejecutadoannio) n_montoejecutado \n\r' +
                                    '   from \n\r' +
                                    '       consulta \n\r' +
                                    '   group by \n\r' +
                                    '       n_annioprograma \n\r' +
                                    '   order by \n\r' +
                                    '       n_annioprograma';

                                console.log(cadena3);

                                pool.query(
                                    cadena3, [n_annio, n_idgen_departamento],
                                    (error, results) => {
                                        if (error) {
                                            response.status(200).json({ estado: false, mensaje: "DB: error datosfasesmonto!." + error.stack, data: null })
                                        } else {
                                            let annios2 = [];
                                            let montoannios1 = [];
                                            let montoannios2 = [];
                                            let datosannios2 = results.rows;
                                            datosannios2.forEach(element => {
                                                annios2.push(element.n_annioprograma);
                                                montoannios1.push(parseFloat(element.n_montoprogramado));
                                                montoannios2.push(parseFloat(element.n_montoejecutado));
                                            });

                                            let cadena4 =
                                                '   ;with	consulta as \n\r' +
                                                '   ( \n\r' +
                                                '       select \n\r' +
                                                '           distinct \n\r' +
                                                '           bp.n_annioprograma, \n\r' +
                                                '           bp.n_idgen_bolsaproyecto, \n\r' +
                                                '           bp.n_montoprogramadoannio, \n\r' +
                                                '           bp.n_presupuestoinicial, \n\r' +
                                                '           bp.n_totalreprogramado, \n\r' +
                                                '           bp.n_totalprogramado \n\r' +
                                                '       from \n\r' +
                                                '           vw_bolsaproyecto bp \n\r' +
                                                '           left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                                                '           left outer join	vw_ubigeodistrito u on u.n_idgen_distrito = bd.n_idgen_distrito \n\r' +
                                                '       where \n\r' +
                                                (n_annio != 0 ? ' (bp.n_annioprograma = $1 or 0 = $1) ' : ' bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1)') + ' \n\r' +
                                                //'           bp.orden = 1 and (bp.n_annioprograma = $1 or 0 = $1) \n\r' +
                                                '           and (coalesce(u.n_idgen_departamento, -100) = $2 or 0 = $2) \n\r' +
                                                '   ) \n\r' +
                                                '   select \n\r' +
                                                '       n_annioprograma, \n\r' +
                                                '       sum(n_montoprogramadoannio) n_montoprogramado, \n\r' +
                                                '       sum(n_presupuestoinicial) n_presupuestoinicial, \n\r' +
                                                '       sum(n_totalreprogramado) n_totalreprogramado, \n\r' +
                                                '       sum(n_totalprogramado) n_totalprogramado \n\r' +
                                                '   from \n\r' +
                                                '       consulta \n\r' +
                                                '   group by \n\r' +
                                                '       n_annioprograma \n\r' +
                                                '   order by \n\r' +
                                                '       n_annioprograma';

                                            console.log(cadena4);

                                            pool.query(
                                                cadena4, [n_annio, n_idgen_departamento],
                                                (error, results) => {
                                                    if (error) {
                                                        response.status(200).json({ estado: false, mensaje: "DB: error datosfasesmonto!." + error.stack, data: null })
                                                    } else {
                                                        let annios3 = [];
                                                        let montopim = [];
                                                        let montopia = [];
                                                        let montoreprogramado = [];
                                                        let montoprogramado = [];
                                                        let datosannios3 = results.rows;
                                                        datosannios3.forEach(element => {
                                                            annios3.push(element.n_annioprograma);
                                                            montopim.push(parseFloat(element.n_montoprogramado));
                                                            montopia.push(parseFloat(element.n_presupuestoinicial));
                                                            montoreprogramado.push(parseFloat(element.n_totalreprogramado));
                                                            montoprogramado.push(parseFloat(element.n_totalprogramado));
                                                        });

                                                        response.status(200).json({
                                                            estado: true, mensaje: "", data: {
                                                                graficodepartamento: { claves: departamentos, cantidades: { cantidaddepartamentos, cantidaddepartamentoscartera, cantidaddepartamentosdesarrollo } },
                                                                graficoannio: { claves: annios, cantidades: { cantidadannios, cantidadcartera, cantidaddesarrollo } },
                                                                graficomonto1: { claves: annios2, cantidades: montoannios1 },
                                                                graficomonto2: { claves: annios2, cantidades: montoannios2 },
                                                                graficomonto3: { claves: annios3, cantidades: { montopim, montopia, montoreprogramado, montoprogramado } }
                                                            }
                                                        })
                                                    }
                                                })

                                            /*response.status(200).json({
                                                estado: true, mensaje: "", data: {
                                                    graficodepartamento: { claves: departamentos, cantidades: { cantidaddepartamentos, cantidaddepartamentoscartera, cantidaddepartamentosdesarrollo } },
                                                    graficoannio: { claves: annios, cantidades: { cantidadannios, cantidadcartera, cantidaddesarrollo } },
                                                    graficomonto1: { claves: annios2, cantidades: montoannios1 },
                                                    graficomonto2: { claves: annios2, cantidades: montoannios2 }
                                                }
                                            })*/
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

const getMonInspecion =  (request, response) => {
    var obj = valida.validaToken(request)
    let n_idpro_proyecto = request.body.n_idpro_proyecto
    let fechaInicio = request.body.fechaInicio
    let fechaFinal = request.body.fechaFinal

    if (obj.estado) {          
        let cadena = 'select pl.c_codigo, count(mi.n_idpl_linea)  from mon_inspeccion mi \n\r' +
                        'inner join pl_linea pl on pl.n_idpl_linea = mi.n_idpl_linea \n\r' +
                        'inner join pl_zona pz on pz.n_idpl_zona = pl.n_idpl_zona \n\r' +
                    'where pz.n_idpro_proyecto = '+ n_idpro_proyecto +' and mi.n_borrado = 0 and  mi.d_fecha between \''+fechaInicio+'\' and \''+fechaFinal+'\' \n\r' +
                    'group by pl.c_codigo  ';
        pool.query(cadena,   
            (error, results) => {
                if (error) {
                    console.log(cadena);
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
                } else {
                    let claves = []
                    let cantidades = []
                    results.rows.forEach(element => {
                        claves.push(element.c_codigo);
                        cantidades.push(element.count)
                    });
                    response.status(200).json({ estado: true, mensaje: "", data: {claves: claves, cantidades: cantidades} })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getDatosGuia =  (request, response) => {
    var obj = valida.validaToken(request)
    let n_idpro_proyecto = request.body.n_idpro_proyecto
    let fechaInicio = request.body.fechaInicio
    let fechaFinal = request.body.fechaFinal

    if (obj.estado) {          
        let cadena = 'select ag.c_nombre, count(ag.c_nombre)  from alm_guia ag \n\r' +
                        'inner join alm_almacen aa on aa.n_idalm_almacen = ag.n_idalm_almacen and aa.n_borrado = 0 \n\r' +
                    'where aa.n_idpro_proyecto = '+ n_idpro_proyecto +'  and ag.n_borrado = 0 and  ag.d_fechacrea between \''+fechaInicio+'\' and \''+fechaFinal+'\' \n\r' +
                    'group by ag.c_nombre';
        pool.query(cadena,   
            (error, results) => {
                if (error) {
                    console.log(cadena);
                    console.log(error);
                    response.status(200).json({ estado: false, mensaje: "DB: error1!.", data: null })
                } else {
                    let claves = []
                    let cantidades = []
                    results.rows.forEach(element => {
                        claves.push(element.c_nombre);
                        cantidades.push(element.count)
                    });
                    response.status(200).json({ estado: true, mensaje: "", data: {claves: claves, cantidades: cantidades} })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

module.exports = {
    getDepartamento,
    getcantidad,
    gettotales,
    getDashboardBolsa,
    getLineas,
    getMonInspecion,
    getDatosGuia
}

