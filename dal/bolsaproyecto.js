const cnx = require('../common/appsettings')
const valida = require('../common/validatoken');
let pool = cnx.pool;

const get = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_annio = request.body.n_annio;

        let cadena = "";

        if (n_annio == 0) {
            cadena =
                ';with consulta as \n\r' +
                '( \n\r' +
                '    select \n\r' +
                '        distinct \n\r' +
                '        bp.n_idgen_bolsaproyecto, \n\r' +
                '        bp.c_nombreproyecto, \n\r' +
                '        bp.c_cui, \n\r' +
                '        bp.n_numerominem, \n\r' +
                '        c_responsable, \n\r' +
                '        f.c_nombre c_estadoactual, \n\r' +
                '        f.n_idgen_fase, \n\r' +
                '        case when p.n_idgen_proyecto is null then false else true end b_existe, \n\r' +
                '        coalesce(bp.n_localidades, 0) n_localidades, \n\r' +
                '        coalesce(bp.n_poblacion, 0) n_poblacion, \n\r' +
                '        coalesce(bp.n_viviendas, 0) n_viviendas, \n\r' +
                '        coalesce(bp.n_kmred, 0) n_kmred, \n\r' +
                '        coalesce(bp.n_trafos, 0) n_trafos, \n\r' +
                '        coalesce(bp.n_lamparas, 0) n_lamparas, \n\r' +
                '       coalesce(b.c_areaasignada, \'\') :: text c_areaasignada, \n\r' +
                '       CASE WHEN bp.b_asignadohsp = true THEN \'EN DESARROLLO\'::text ELSE \'EN CARTERA\'::text END AS c_estado, \n\r' +
                '       b.n_annioprograma \n\r' +
                '    from \n\r' +
                '        gen_bolsaproyecto bp \n\r' +
                '        left outer join    gen_proyecto p on bp.n_idgen_bolsaproyecto = p.n_idgen_bolsaproyecto and p.n_borrado = 0 \n\r' +
                '        left outer join    gen_fase f on bp.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 \n\r' +
                '        left outer join	vw_bolsaproyecto b on b.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and b.orden = 1 \n\r' +
                '        left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                '        left outer join	gen_distrito di on di.n_idgen_distrito = bd.n_idgen_distrito and di.n_borrado = 0 \n\r' +
                '        left outer join	gen_provincia pr on pr.n_idgen_provincia = di.n_idgen_provincia and pr.n_borrado = 0 \n\r' +
                '    where \n\r' +
                '        bp.n_borrado = 0 \n\r' +
                '        and (b.n_annioprograma = ' + n_annio + ' or ' + n_annio + ' = 0) \n\r' +
                '        and (coalesce(pr.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
                '        and (pr.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
                '        and (di.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
                ') \n\r' +
                'select \n\r' +
                '    row_number() over(order by n_numerominem) num, \n\r' +
                '    * \n\r' +
                'from \n\r' +
                '    consulta \n\r' +
                'order by n_numerominem';
        } else {
            cadena =
                ';with consulta as \n\r' +
                '( \n\r' +
                '    select \n\r' +
                '        distinct \n\r' +
                '        bp.n_idgen_bolsaproyecto, \n\r' +
                '        bp.c_nombreproyecto, \n\r' +
                '        bp.c_cui, \n\r' +
                '        bp.n_numerominem, \n\r' +
                '        c_responsable, \n\r' +
                '        f.c_nombre c_estadoactual, \n\r' +
                '        f.n_idgen_fase, \n\r' +
                '        case when p.n_idgen_proyecto is null then false else true end b_existe, \n\r' +
                '        coalesce(bp.n_localidades, 0) n_localidades, \n\r' +
                '        coalesce(bp.n_poblacion, 0) n_poblacion, \n\r' +
                '        coalesce(bp.n_viviendas, 0) n_viviendas, \n\r' +
                '        coalesce(bp.n_kmred, 0) n_kmred, \n\r' +
                '        coalesce(bp.n_trafos, 0) n_trafos, \n\r' +
                '        coalesce(bp.n_lamparas, 0) n_lamparas, \n\r' +
                '       coalesce(b.c_areaasignada, \'\') :: text c_areaasignada, \n\r' +
                '       CASE WHEN bp.b_asignadohsp = true THEN \'EN DESARROLLO\'::text ELSE \'EN CARTERA\'::text END AS c_estado, \n\r' +
                '       b.n_annioprograma \n\r' +
                '    from \n\r' +
                '        gen_bolsaproyecto bp \n\r' +
                '        left outer join    gen_proyecto p on bp.n_idgen_bolsaproyecto = p.n_idgen_bolsaproyecto and p.n_borrado = 0 \n\r' +
                '        left outer join    gen_fase f on bp.n_idgen_fase = f.n_idgen_fase and f.n_borrado = 0 \n\r' +
                '        left outer join	vw_bolsaproyecto b on b.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and (b.n_annioprograma = ' + n_annio + ' or ' + n_annio + ' = 0) \n\r' +
                '        left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                '        left outer join	gen_distrito di on di.n_idgen_distrito = bd.n_idgen_distrito and di.n_borrado = 0 \n\r' +
                '        left outer join	gen_provincia pr on pr.n_idgen_provincia = di.n_idgen_provincia and pr.n_borrado = 0 \n\r' +
                '    where \n\r' +
                '        bp.n_borrado = 0 \n\r' +
                '        and (b.n_annioprograma = ' + n_annio + ' or ' + n_annio + ' = 0) \n\r' +
                '        and (coalesce(pr.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
                '        and (pr.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
                '        and (di.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
                ') \n\r' +
                'select \n\r' +
                '    row_number() over(order by n_numerominem) num, \n\r' +
                '    * \n\r' +
                'from \n\r' +
                '    consulta \n\r' +
                'order by n_numerominem';
        }

        console.log(cadena);

        pool.query(
            cadena,
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

const save = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let c_nombreproyecto = request.body.c_nombreproyecto;
        let c_cui = request.body.c_cui;
        let c_responsable = request.body.c_responsable;
        let n_idgen_fase = request.body.n_idgen_fase;
        let n_numerominem = request.body.n_numerominem;

        let n_localidades = request.body.n_localidades;
        let n_poblacion = request.body.n_poblacion;
        let n_viviendas = request.body.n_viviendas;
        let n_kmred = request.body.n_kmred;
        let n_trafos = request.body.n_trafos;
        let n_lamparas = request.body.n_lamparas;

        let cadena = '';

        if (n_idgen_bolsaproyecto == 0) {
            cadena = 'insert into gen_bolsaproyecto(n_idgen_bolsaproyecto,c_nombreproyecto,c_cui,c_responsable,n_idgen_fase,n_borrado,d_fechacrea,n_id_usercrea,n_numerominem,b_asignadohsp,n_localidades,n_poblacion,n_viviendas,n_kmred,n_trafos,n_lamparas) \n\r' +
                'values (default,\'' + c_nombreproyecto + '\',\'' + c_cui + '\', \'' + c_responsable + '\',null,0,now(),1,' + n_numerominem + ', false, ' + n_localidades + ',' + n_poblacion + ',' + n_viviendas + ',' + n_kmred + ',' + n_trafos + ',' + n_lamparas + ') returning *;';
        } else {
            cadena = 'update gen_bolsaproyecto set ' +
                'c_nombreproyecto= \'' + c_nombreproyecto + '\'' +
                ',c_cui= \'' + c_cui + '\'' +
                ',c_responsable= \'' + c_responsable + '\'' +
                //',n_idgen_fase= ' + n_idgen_fase +
                ',n_numerominem= ' + n_numerominem +
                ',n_localidades= ' + n_localidades +
                ',n_poblacion= ' + n_poblacion +
                ',n_viviendas= ' + n_viviendas +
                ',n_kmred= ' + n_kmred +
                ',n_trafos= ' + n_trafos +
                ',n_lamparas= ' + n_lamparas +
                ' where n_idgen_bolsaproyecto=' + n_idgen_bolsaproyecto + ' returning *;';
        }

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}


const crearproyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let c_nombreproyecto = request.body.c_nombreproyecto;
        let c_cui = request.body.c_cui;
        //let c_responsable = request.body.c_responsable;
        //let n_idgen_fase = request.body.n_idgen_fase;
        let n_numerominem = request.body.n_numerominem;
        let cadena = '';

        cadena = 'insert into gen_proyecto (n_idgen_proyecto,c_nombreproyecto,c_codigocui,n_idgen_bolsaproyecto,n_borrado,d_fechacrea,n_id_usercrea,c_codigomem,n_orden) \n\r' +
            'values (default,\'' + c_nombreproyecto + '\',\'' + c_cui + '\',' + n_idgen_bolsaproyecto + ',0,now(),1, \'' + n_numerominem + '\',' + n_numerominem + ') returning *;';

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    let n_idgen_proyecto = results.rows[0].n_idgen_proyecto;
                    let cadenaupd = 'update gen_bolsaproyecto set b_asignadohsp=true where n_idgen_bolsaproyecto=' + n_idgen_bolsaproyecto + ';';
                    pool.query(cadenaupd,
                        (error, results) => {
                            if (error) {
                                response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                            } else {

                                response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                            }
                        })
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getdetalle = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;

        pool.query('select d.* ' + //d.n_idgen_bolsadetalle,d.n_idgen_bolsaproyecto,d.n_annioprograma,d.c_areaasignada,d.n_costoinversion,d.c_observaciones,d.n_montoprogramadoannio,d.n_montoejecutadoannio,d.n_diferenciatotal ' +
            '' +
            'from gen_bolsadetalle d ' +
            'inner join	gen_bolsaproyecto b on b.n_idgen_bolsaproyecto = d.n_idgen_bolsaproyecto and b.n_borrado = 0 ' +
            'where d.n_borrado = 0 and b.n_idgen_bolsaproyecto = ' + n_idgen_bolsaproyecto + ' order by n_annioprograma',
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

const savedetalle = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsadetalle = request.body.n_idgen_bolsadetalle;
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_annioprograma = request.body.n_annioprograma;
        let c_areaasignada = request.body.c_areaasignada;
        let n_costoinversion = request.body.n_costoinversion;
        let c_observaciones = request.body.c_observaciones;

        let n_montoprogramadoannio = request.body.n_montoprogramadoannio;
        let n_montoejecutadoannio = request.body.n_montoejecutadoannio;
        let n_diferenciatotal = request.body.n_diferenciatotal;
        let n_presupuestoinicial = request.body.n_presupuestoinicial;
        let n_montoprogene = request.body.n_montoprogene;
        let n_montoprogfeb = request.body.n_montoprogfeb;
        let n_montoprogmar = request.body.n_montoprogmar;
        let n_montoprogabr = request.body.n_montoprogabr;
        let n_montoprogmay = request.body.n_montoprogmay;
        let n_montoprogjun = request.body.n_montoprogjun;
        let n_montoprogjul = request.body.n_montoprogjul;
        let n_montoprogago = request.body.n_montoprogago;
        let n_montoprogset = request.body.n_montoprogset;
        let n_montoprogoct = request.body.n_montoprogoct;
        let n_montoprognov = request.body.n_montoprognov;
        let n_montoprogdic = request.body.n_montoprogdic;
        let n_montoejecene = request.body.n_montoejecene;
        let n_montoejecfeb = request.body.n_montoejecfeb;
        let n_montoejecmar = request.body.n_montoejecmar;
        let n_montoejecabr = request.body.n_montoejecabr;
        let n_montoejecmay = request.body.n_montoejecmay;
        let n_montoejecjun = request.body.n_montoejecjun;
        let n_montoejecjul = request.body.n_montoejecjul;
        let n_montoejecago = request.body.n_montoejecago;
        let n_montoejecset = request.body.n_montoejecset;
        let n_montoejecoct = request.body.n_montoejecoct;
        let n_montoejecnov = request.body.n_montoejecnov;
        let n_montoejecdic = request.body.n_montoejecdic;
        let n_montoreprene = request.body.n_montoreprene;
        let n_montoreprfeb = request.body.n_montoreprfeb;
        let n_montoreprmar = request.body.n_montoreprmar;
        let n_montoreprabr = request.body.n_montoreprabr;
        let n_montoreprmay = request.body.n_montoreprmay;
        let n_montoreprjun = request.body.n_montoreprjun;
        let n_montoreprjul = request.body.n_montoreprjul;
        let n_montoreprago = request.body.n_montoreprago;
        let n_montoreprset = request.body.n_montoreprset;
        let n_montoreproct = request.body.n_montoreproct;
        let n_montoreprnov = request.body.n_montoreprnov;
        let n_montoreprdic = request.body.n_montoreprdic;


        let cadena = '';

        if (n_idgen_bolsadetalle == 0) {
            cadena =
                'insert into gen_bolsadetalle (n_idgen_bolsadetalle,n_idgen_bolsaproyecto,n_annioprograma,c_areaasignada,n_costoinversion,c_observaciones,n_borrado,n_id_usercrea,d_fechacrea,n_montoprogramadoannio,n_montoejecutadoannio,n_diferenciatotal \n\r' +
                ',n_presupuestoinicial \n\r' +
                ',n_montoprogene \n\r' +
                ',n_montoprogfeb \n\r' +
                ',n_montoprogmar \n\r' +
                ',n_montoprogabr \n\r' +
                ',n_montoprogmay \n\r' +
                ',n_montoprogjun \n\r' +
                ',n_montoprogjul \n\r' +
                ',n_montoprogago \n\r' +
                ',n_montoprogset \n\r' +
                ',n_montoprogoct \n\r' +
                ',n_montoprognov \n\r' +
                ',n_montoprogdic \n\r' +
                ',n_montoejecene \n\r' +
                ',n_montoejecfeb \n\r' +
                ',n_montoejecmar \n\r' +
                ',n_montoejecabr \n\r' +
                ',n_montoejecmay \n\r' +
                ',n_montoejecjun \n\r' +
                ',n_montoejecjul \n\r' +
                ',n_montoejecago \n\r' +
                ',n_montoejecset \n\r' +
                ',n_montoejecoct \n\r' +
                ',n_montoejecnov \n\r' +
                ',n_montoejecdic \n\r' +
                ',n_montoreprene \n\r' +
                ',n_montoreprfeb \n\r' +
                ',n_montoreprmar \n\r' +
                ',n_montoreprabr \n\r' +
                ',n_montoreprmay \n\r' +
                ',n_montoreprjun \n\r' +
                ',n_montoreprjul \n\r' +
                ',n_montoreprago \n\r' +
                ',n_montoreprset \n\r' +
                ',n_montoreproct \n\r' +
                ',n_montoreprnov \n\r' +
                ',n_montoreprdic \n\r' +
                ') \n\r' +
                'values ((select max(n_idgen_bolsadetalle) + 1 from gen_bolsadetalle),' + n_idgen_bolsaproyecto + ',' + n_annioprograma + ',\'' + c_areaasignada + '\',' + n_costoinversion + ',\'' + c_observaciones + '\',0,1,now(),' + n_montoprogramadoannio + ',' + n_montoejecutadoannio + ',' + n_diferenciatotal + ' \n\r' +
                ',' + n_presupuestoinicial + ' \n\r' +
                ',' + n_montoprogene + ' \n\r' +
                ',' + n_montoprogfeb + ' \n\r' +
                ',' + n_montoprogmar + ' \n\r' +
                ',' + n_montoprogabr + ' \n\r' +
                ',' + n_montoprogmay + ' \n\r' +
                ',' + n_montoprogjun + ' \n\r' +
                ',' + n_montoprogjul + ' \n\r' +
                ',' + n_montoprogago + ' \n\r' +
                ',' + n_montoprogset + ' \n\r' +
                ',' + n_montoprogoct + ' \n\r' +
                ',' + n_montoprognov + ' \n\r' +
                ',' + n_montoprogdic + ' \n\r' +
                ',' + n_montoejecene + ' \n\r' +
                ',' + n_montoejecfeb + ' \n\r' +
                ',' + n_montoejecmar + ' \n\r' +
                ',' + n_montoejecabr + ' \n\r' +
                ',' + n_montoejecmay + ' \n\r' +
                ',' + n_montoejecjun + ' \n\r' +
                ',' + n_montoejecjul + ' \n\r' +
                ',' + n_montoejecago + ' \n\r' +
                ',' + n_montoejecset + ' \n\r' +
                ',' + n_montoejecoct + ' \n\r' +
                ',' + n_montoejecnov + ' \n\r' +
                ',' + n_montoejecdic + ' \n\r' +
                ',' + n_montoreprene + ' \n\r' +
                ',' + n_montoreprfeb + ' \n\r' +
                ',' + n_montoreprmar + ' \n\r' +
                ',' + n_montoreprabr + ' \n\r' +
                ',' + n_montoreprmay + ' \n\r' +
                ',' + n_montoreprjun + ' \n\r' +
                ',' + n_montoreprjul + ' \n\r' +
                ',' + n_montoreprago + ' \n\r' +
                ',' + n_montoreprset + ' \n\r' +
                ',' + n_montoreproct + ' \n\r' +
                ',' + n_montoreprnov + ' \n\r' +
                ',' + n_montoreprdic + ' \n\r' +
                ') returning *;';
        } else {
            cadena = 'update gen_bolsadetalle set ' +
                'c_areaasignada= \'' + c_areaasignada + '\'' +
                ',n_costoinversion= ' + n_costoinversion +
                ',n_montoprogramadoannio= ' + n_montoprogramadoannio +
                ',n_montoejecutadoannio= ' + n_montoejecutadoannio +
                ',n_diferenciatotal= ' + n_diferenciatotal +
                ',c_observaciones= \'' + c_observaciones + '\'' +
                ',n_presupuestoinicial= ' + n_presupuestoinicial +
                ',n_montoprogene= ' + n_montoprogene +
                ',n_montoprogfeb= ' + n_montoprogfeb +
                ',n_montoprogmar= ' + n_montoprogmar +
                ',n_montoprogabr= ' + n_montoprogabr +
                ',n_montoprogmay= ' + n_montoprogmay +
                ',n_montoprogjun= ' + n_montoprogjun +
                ',n_montoprogjul= ' + n_montoprogjul +
                ',n_montoprogago= ' + n_montoprogago +
                ',n_montoprogset= ' + n_montoprogset +
                ',n_montoprogoct= ' + n_montoprogoct +
                ',n_montoprognov= ' + n_montoprognov +
                ',n_montoprogdic= ' + n_montoprogdic +
                ',n_montoejecene= ' + n_montoejecene +
                ',n_montoejecfeb= ' + n_montoejecfeb +
                ',n_montoejecmar= ' + n_montoejecmar +
                ',n_montoejecabr= ' + n_montoejecabr +
                ',n_montoejecmay= ' + n_montoejecmay +
                ',n_montoejecjun= ' + n_montoejecjun +
                ',n_montoejecjul= ' + n_montoejecjul +
                ',n_montoejecago= ' + n_montoejecago +
                ',n_montoejecset= ' + n_montoejecset +
                ',n_montoejecoct= ' + n_montoejecoct +
                ',n_montoejecnov= ' + n_montoejecnov +
                ',n_montoejecdic= ' + n_montoejecdic +
                ',n_montoreprene= ' + n_montoreprene +
                ',n_montoreprfeb= ' + n_montoreprfeb +
                ',n_montoreprmar= ' + n_montoreprmar +
                ',n_montoreprabr= ' + n_montoreprabr +
                ',n_montoreprmay= ' + n_montoreprmay +
                ',n_montoreprjun= ' + n_montoreprjun +
                ',n_montoreprjul= ' + n_montoreprjul +
                ',n_montoreprago= ' + n_montoreprago +
                ',n_montoreprset= ' + n_montoreprset +
                ',n_montoreproct= ' + n_montoreproct +
                ',n_montoreprnov= ' + n_montoreprnov +
                ',n_montoreprdic= ' + n_montoreprdic +

                ' where n_idgen_bolsadetalle=' + n_idgen_bolsadetalle + ' returning *;';
        }

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const deletedetalle = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsadetalle = request.body.n_idgen_bolsadetalle;
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_annioprograma = request.body.n_annioprograma;
        let c_areaasignada = request.body.c_areaasignada;
        let n_costoinversion = request.body.n_costoinversion;
        let c_observaciones = request.body.c_observaciones;

        let cadena = '';

        cadena = 'update gen_bolsadetalle set ' +
            ' n_borrado= ' + n_idgen_bolsadetalle +
            ' where n_idgen_bolsadetalle=' + n_idgen_bolsadetalle + ' returning *;';

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const get_exportbolsadetalle = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_annio = request.body.n_annio;

        let cadena = "";

        if (n_annio == 0) {
            cadena =
                '   select distinct bp.* from vw_bolsaproyecto_xls bp \n\r' +
                '   left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                '   left outer join	gen_distrito di on di.n_idgen_distrito = bd.n_idgen_distrito and di.n_borrado = 0 \n\r' +
                '   left outer join	gen_provincia pr on pr.n_idgen_provincia = di.n_idgen_provincia and pr.n_borrado = 0 \n\r' +
                '   where bp.orden = 1 and (bp.n_annioprograma = ' + n_annio + ' or 0 = ' + n_annio + ') \n\r' +
                '        and (coalesce(pr.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
                '        and (pr.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
                '        and (di.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
                '        and (bp.n_idgen_bolsaproyecto = ' + n_idgen_bolsaproyecto + ' or ' + n_idgen_bolsaproyecto + ' = 0) \n\r' +
                '   order by bp.n_numerominem';
        } else {
            cadena =
                '   select distinct bp.* from vw_bolsaproyecto_xls bp \n\r' +
                '   left outer join	gen_bolsadistrito bd on bd.n_idgen_bolsaproyecto = bp.n_idgen_bolsaproyecto and bd.n_borrado = 0 \n\r' +
                '   left outer join	gen_distrito di on di.n_idgen_distrito = bd.n_idgen_distrito and di.n_borrado = 0 \n\r' +
                '   left outer join	gen_provincia pr on pr.n_idgen_provincia = di.n_idgen_provincia and pr.n_borrado = 0 \n\r' +
                '   where (bp.n_annioprograma = ' + n_annio + ' or 0 = ' + n_annio + ') \n\r' +
                '        and (coalesce(pr.n_idgen_departamento, -100) = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
                '        and (pr.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
                '        and (di.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
                '        and (bp.n_idgen_bolsaproyecto = ' + n_idgen_bolsaproyecto + ' or ' + n_idgen_bolsaproyecto + ' = 0) \n\r' +
                '   order by bp.n_numerominem';
        }

        console.log(cadena);
        pool.query(cadena,
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

const getannioprogramacion = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query(
            '   select 2020 :: int n_annio \n\r' +
            '   union select 2021 :: int n_annio \n\r' +
            '   union select 2022 :: int n_annio \n\r' +
            '   union select 2023 :: int n_annio \n\r' +
            '   union select 2024 :: int n_annio \n\r' +
            '   union select 2025 :: int n_annio \n\r' +
            '   union select 2026 :: int n_annio \n\r' +
            '   union select 2027 :: int n_annio \n\r' +
            '   union select 2028 :: int n_annio \n\r' +
            '   union select 2029 :: int n_annio \n\r' +
            '   union select 2030 :: int n_annio \n\r' +
            '   order by 1',
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

const deletebolsa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;

        let cadena = '';

        cadena = 'update gen_bolsaproyecto set ' +
            ' n_borrado= ' + n_idgen_bolsaproyecto +
            ' where n_idgen_bolsaproyecto=' + n_idgen_bolsaproyecto + ' returning *;';

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getubigeobolsa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {

        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_idgen_departamento = request.body.n_idgen_departamento;
        let n_idgen_provincia = request.body.n_idgen_provincia;
        let n_idgen_distrito = request.body.n_idgen_distrito;

        pool.query(
            '   select \n\r' +
            '       di.n_idgen_distrito, \n\r' +
            '       de.c_nombre c_departamento, \n\r' +
            '       pr.c_nombre c_provincia, \n\r' +
            '       di.c_nombre c_distrito, \n\r' +
            '       coalesce(bd.n_idgen_bolsadistrito, 0) :: int n_idgen_bolsadistrito, \n\r' +
            '       case when bd.n_idgen_bolsadistrito is null then false else true end b_asignado \n\r' +
            '   from \n\r' +
            '       gen_distrito di \n\r' +
            '       inner join	gen_provincia pr on pr.n_idgen_provincia = di.n_idgen_provincia and pr.n_borrado = 0 \n\r' +
            '       inner join	gen_departamento de on de.n_idgen_departamento = pr.n_idgen_departamento and de.n_borrado = 0 \n\r' +
            '       left outer join	gen_bolsadistrito bd on bd.n_idgen_distrito = di.n_idgen_distrito and bd.n_borrado = 0 and bd.n_idgen_bolsaproyecto = ' + n_idgen_bolsaproyecto + ' \n\r' +
            '   where \n\r' +
            '       di.n_borrado = 0 \n\r' +
            '       and (pr.n_idgen_departamento = ' + n_idgen_departamento + ' or ' + n_idgen_departamento + ' = 0) \n\r' +
            '       and (pr.n_idgen_provincia = ' + n_idgen_provincia + ' or ' + n_idgen_provincia + ' = 0) \n\r' +
            '       and (di.n_idgen_distrito = ' + n_idgen_distrito + ' or ' + n_idgen_distrito + ' = 0) \n\r' +
            '   order by de.c_nombre, pr.c_nombre, di.c_nombre',
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

const saveubigeobolsa = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;
        let n_idgen_distrito = request.body.n_idgen_distrito;
        let n_idgen_bolsadistrito = request.body.n_idgen_bolsadistrito;

        let cadena = '';

        if (n_idgen_bolsadistrito == 0) {
            cadena =
                'insert into gen_bolsadistrito (n_idgen_bolsadistrito,n_idgen_distrito,n_idgen_bolsaproyecto,n_borrado,n_id_usercrea,d_fechacrea) \n\r' +
                'values ((select max(n_idgen_bolsadistrito) + 1 from gen_bolsadistrito),' + n_idgen_distrito + ',' + n_idgen_bolsaproyecto + ',0,1,now()) returning *;';
        } else {
            cadena =
                ' update gen_bolsadistrito set ' +
                ' n_borrado=' + n_idgen_bolsadistrito +
                ' where n_idgen_bolsadistrito=' + n_idgen_bolsadistrito + ' returning *;';
        }

        console.log(cadena);
        pool.query(cadena,
            (error, results) => {
                if (error) {
                    response.status(200).json({ estado: false, mensaje: "DB: error!. " + error.stack, data: null });
                } else {
                    response.status(200).json({ estado: true, mensaje: "", data: results.rows });
                }
            })
    } else {
        response.status(200).json(obj)
    }
}

const getdepartamento = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_departamento, u.c_departamento c_nombre from vw_ubigeodistrito u \n\r' +
            'group by \n\r' +
            'u.n_idgen_departamento, \n\r' +
            'u.c_departamento \n\r' +
            'order by c_departamento ',
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

const getprovincia = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_provincia, u.c_provincia c_nombre from vw_ubigeodistrito u \n\r' +
            'where (n_idgen_departamento = $1 or 0 = $1) \n\r' +
            'group by \n\r' +
            'u.n_idgen_provincia, \n\r' +
            'u.c_provincia \n\r' +
            'order by c_provincia ', [request.body.n_idgen_departamento],
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

const getdistrito = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        pool.query('select u.n_idgen_distrito, u.c_distrito c_nombre from vw_ubigeodistrito u \n\r' +
            'where (n_idgen_departamento = $1 or 0 = $1) and (n_idgen_provincia = $2 or 0 = $2) \n\r' +
            'group by \n\r' +
            'u.n_idgen_distrito, \n\r' +
            'u.c_distrito \n\r' +
            'order by c_distrito ',
            [request.body.n_idgen_departamento, request.body.n_idgen_provincia],
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

const getUbigeoBolsaProyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idgen_bolsaproyecto = request.body.n_idgen_bolsaproyecto;

        pool.query(
            '   ;with consulta as \n\r' +
            '   ( \n\r' +
            '       select 1 n_fila,* from fn_getubigeobolsa($1,1) \n\r' +
            '       union \n\r' +
            '       select 2 n_fila,* from fn_getubigeobolsa($1,2) \n\r' +
            '       union \n\r' +
            '       select 3 n_fila,* from fn_getubigeobolsa($1,3) \n\r' +
            '   ) \n\r' +
            '   select n_fila, fn_getubigeobolsa as c_ubigeo from consulta order by n_fila', [n_idgen_bolsaproyecto],
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

module.exports = {
    get,
    save,
    crearproyecto,
    getdetalle,
    savedetalle,
    deletedetalle,
    get_exportbolsadetalle,
    getannioprogramacion,
    deletebolsa,
    getubigeobolsa,
    saveubigeobolsa,
    getdepartamento,
    getprovincia,
    getdistrito,
    getUbigeoBolsaProyecto
}
