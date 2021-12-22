const express = require('express')
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var cors = require('cors');
var multer = require('multer');
const fs = require('fs'); 
var path = require('path')
const dbSeguridad = require('./dal/seguridad')
const dbGeneral = require('./dal/general')
const dbMapa = require('./dal/mapa')
const dbDashboard = require('./dal/dashboard')
const dbProyecto = require('./dal/proyecto')
const dbTipoProyecto = require('./dal/tipoproyecto')
const dbTarea = require('./dal/tarea')
const dbUbigeo = require('./dal/ubigeo')
const dbBolsaProyecto = require('./dal/bolsaproyecto')
const dbPrograma = require('./dal/programa')
const bdConfiguracionGeneral = require('./dal/configuracionGeneral')
const bdAlmacen = require('./dal/almacen')

const app = express()
const port = 3400

const ruta = '/archivos/proyectos';

app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, req.query.c_ruta);
  },
  filename: function (req, file, callback) {
    callback(null, req.query.c_nombre);
  }
});
var upload = multer({ storage: storage }).single('DA');


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.use('/static', express.static(__dirname + ruta));

/* Seguridad */
app.post('/api/seguridad/login', dbSeguridad.login)
app.post('/api/seguridad/get', dbSeguridad.get)
app.post('/api/seguridad/getrole', dbSeguridad.getrole)
app.post('/api/seguridad/save', dbSeguridad.save)
app.post('/api/seguridad/resetearclave', dbSeguridad.resetearclave)
app.post('/api/seguridad/delete_usuario', dbSeguridad.delete_usuario)
app.post('/api/seguridad/saveRol', dbSeguridad.saveRol)
app.post('/api/seguridad/deleteRol',dbSeguridad.deleteRol)

/*Configuracion General */
app.post('/api/configuracionGeneral/getempresa',bdConfiguracionGeneral.getempresa)
app.post('/api/configuracionGeneral/saveEmpresa',bdConfiguracionGeneral.saveEmpresa) 
app.post('/api/configuracionGeneral/deleteEmpresa',bdConfiguracionGeneral.deleteEmpresa)
app.post('/api/configuracionGeneral/saveLinea',bdConfiguracionGeneral.saveLinea)
app.post('/api/configuracionGeneral/getLinea',bdConfiguracionGeneral.getLinea)
app.post('/api/configuracionGeneral/deleteLinea',bdConfiguracionGeneral.deleteLinea) 
app.post('/api/configuracionGeneral/gettipolinea',bdConfiguracionGeneral.gettipolinea) 
app.post('/api/configuracionGeneral/saveTipoLinea',bdConfiguracionGeneral.saveTipoLinea) 
app.post('/api/configuracionGeneral/deleteTipoLinea',bdConfiguracionGeneral.deleteTipoLinea)
app.post('/api/configuracionGeneral/getZona',bdConfiguracionGeneral.getZona) 
app.post('/api/configuracionGeneral/saveZona',bdConfiguracionGeneral.saveZona) 
app.post('/api/configuracionGeneral/deleteZona',bdConfiguracionGeneral.deleteZona) 
app.post('/api/configuracionGeneral/getProyecto',bdConfiguracionGeneral.getProyecto) 
app.post('/api/configuracionGeneral/saveProyecto',bdConfiguracionGeneral.saveProyecto) 
app.post('/api/configuracionGeneral/deleteProyecto',bdConfiguracionGeneral.deleteProyecto) 
app.post('/api/configuracionGeneral/getTipoFoto',bdConfiguracionGeneral.getTipoFoto) 
app.post('/api/configuracionGeneral/saveTipoFoto',bdConfiguracionGeneral.saveTipoFoto) 
app.post('/api/configuracionGeneral/deleteTipoFoto',bdConfiguracionGeneral.deleteTipoFoto) 
app.post('/api/configuracionGeneral/getEstructura',bdConfiguracionGeneral.getEstructura) 
app.post('/api/configuracionGeneral/saveEstructura',bdConfiguracionGeneral.saveEstructura) 
app.post('/api/configuracionGeneral/deleteEstructura',bdConfiguracionGeneral.deleteEstructura) 
app.post('/api/configuracionGeneral/getTipoEmpresa',bdConfiguracionGeneral.getTipoEmpresa) 
app.post('/api/configuracionGeneral/saveTipoEmpresa',bdConfiguracionGeneral.saveTipoEmpresa) 
app.post('/api/configuracionGeneral/deleteTipoEmpresa',bdConfiguracionGeneral.deleteTipoEmpresa)

/*Almacen */
app.post('/api/almacen/getAlmacen',bdAlmacen.getAlmacen) 
app.post('/api/almacen/getAlmacenes',bdAlmacen.getAlmacenes)
app.post('/api/almacen/getProyecto',bdAlmacen.getProyecto) 
app.post('/api/almacen/saveAlmacen',bdAlmacen.saveAlmacen) 
app.post('/api/almacen/deleteAlmacen',bdAlmacen.deleteAlmacen) 
app.post('/api/almacen/getPeriodos',bdAlmacen.getPeriodos) 
app.post('/api/almacen/getGuia',bdAlmacen.getGuia) 
app.post('/api/almacen/saveGuia',bdAlmacen.saveGuia) 
app.post('/api/almacen/deleteGuia',bdAlmacen.deleteGuia) 
app.post('/api/almacen/getGuias',bdAlmacen.getGuias) 
app.post('/api/almacen/getElementos',bdAlmacen.getElementos) 
app.post('/api/almacen/getDetalleGuia',bdAlmacen.getDetalleGuia) 
app.post('/api/almacen/saveDetalleGuia',bdAlmacen.saveDetalleGuia) 
app.post('/api/almacen/deleteDetalleGuia',bdAlmacen.deleteDetalleGuia)
app.post('/api/almacen/uploadimagen', function (req, res) {
  let detalleguia = req.query.detalleguia;
  let dir = __dirname.replace('\dal', '') + "/archivos/imgDetalleguia/" + detalleguia + "/";
  let c_nombre = req.query.extension;

  if (!fs.existsSync(dir)) {
    
    fs.mkdirSync(dir, 0744);
  }

  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;

  console.log("Ruta",dir);
  console.log("nombre",c_nombre);
  upload(req, res, function (err) {
    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {
      res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: dir, c_nombreImg: c_nombre  })
    }
  });
}) 
app.post('/api/almacen/saveImgDetalleGuia',bdAlmacen.saveImgDetalleGuia)

/* General */
app.post('/api/general/get', dbGeneral.get)
app.post('/api/general/save', dbGeneral.save)
app.post('/api/general/get_feriado', dbGeneral.get_feriado)
app.post('/api/general/save_feriado', dbGeneral.save_feriado)

app.post('/api/general/getdepartamento', dbGeneral.getdepartamento)
app.post('/api/general/getprovincia', dbGeneral.getprovincia)
app.post('/api/general/getdistrito', dbGeneral.getdistrito)
app.post('/api/general/getcentropoblado', dbGeneral.getcentropoblado)

/* Mapa */
app.post('/api/mapa/get', dbMapa.get)
app.post('/api/mapa/getxls', dbMapa.getxls)
app.post('/api/mapa/getfiles', dbMapa.getfiles)
app.post('/api/mapa/get_proyecto_atributo', dbMapa.get_proyecto_atributo)
app.post('/api/mapa/gettareasincompletas', dbMapa.gettareasincompletas)


app.get("/api/mapa/download", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/' + req.query.nombre;
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);

  res.download(file);
})

/* Programa */
app.post('/api/programa/getversion', dbPrograma.getversion)
app.post('/api/programa/save', dbPrograma.save)
app.post('/api/programa/getprograma', dbPrograma.getprograma)
app.post('/api/programa/saveprograma', dbPrograma.saveprograma)
app.post('/api/programa/deleteprograma', dbPrograma.deleteprograma)
app.post('/api/programa/copiar', dbPrograma.copiar)
app.post('/api/programa/deleteversion', dbPrograma.deleteversion)

/*Bolsa Proyecto */
app.post('/api/bolsaproyecto/get', dbBolsaProyecto.get)
app.post('/api/bolsaproyecto/save', dbBolsaProyecto.save)
app.post('/api/bolsaproyecto/crearproyecto', dbBolsaProyecto.crearproyecto)
app.post('/api/bolsaproyecto/getdetalle', dbBolsaProyecto.getdetalle)
app.post('/api/bolsaproyecto/savedetalle', dbBolsaProyecto.savedetalle)
app.post('/api/bolsaproyecto/deletedetalle', dbBolsaProyecto.deletedetalle)
app.post('/api/bolsaproyecto/get_exportbolsadetalle', dbBolsaProyecto.get_exportbolsadetalle)
app.post('/api/bolsaproyecto/getannioprogramacion', dbBolsaProyecto.getannioprogramacion)
app.post('/api/bolsaproyecto/deletebolsa', dbBolsaProyecto.deletebolsa)
app.post('/api/bolsaproyecto/getubigeobolsa', dbBolsaProyecto.getubigeobolsa)
app.post('/api/bolsaproyecto/saveubigeobolsa', dbBolsaProyecto.saveubigeobolsa)
app.post('/api/bolsaproyecto/getdepartamento', dbBolsaProyecto.getdepartamento)
app.post('/api/bolsaproyecto/getprovincia', dbBolsaProyecto.getprovincia)
app.post('/api/bolsaproyecto/getdistrito', dbBolsaProyecto.getdistrito)
app.post('/api/bolsaproyecto/getubigeobolsaproyecto', dbBolsaProyecto.getUbigeoBolsaProyecto)


/* Dashboar */
app.post('/api/dashboard/getdepartamento', dbDashboard.getDepartamento)
app.post('/api/dashboard/getcantidad', dbDashboard.getcantidad)
app.post('/api/dashboard/gettotales', dbDashboard.gettotales)
app.post('/api/dashboard/getdashboardbolsa', dbDashboard.getDashboardBolsa)

/* Proyecto */
app.post('/api/proyecto/get', dbProyecto.get)
app.post('/api/proyecto/getid', dbProyecto.getid)
app.post('/api/proyecto/get_lista', dbProyecto.get_lista)
app.post('/api/proyecto/getid_dos', dbProyecto.getid_dos)
app.post('/api/proyecto/save', dbProyecto.save)
app.post('/api/proyecto/get_tarea_proyecto', dbProyecto.get_tarea_proyecto)
app.post('/api/proyecto/get_tarea_proyecto_registro', dbProyecto.get_tarea_proyecto_registro)
app.post('/api/proyecto/get_tarea_edit_proyecto_registro', dbProyecto.get_tarea_edit_proyecto_registro)
app.post('/api/proyecto/save_tarea_proyecto', dbProyecto.save_tarea_proyecto)
app.post('/api/proyecto/save_valor_datoadicional', dbProyecto.save_valor_datoadicional)
app.post('/api/proyecto/delete_proyecto', dbProyecto.delete_proyecto)
app.post('/api/proyecto/get_proyecto_atributo', dbProyecto.get_proyecto_atributo)
app.post('/api/proyecto/get_proyecto_atributo_file', dbProyecto.get_proyecto_atributo_file)
app.post('/api/proyecto/fechar_tarea', dbProyecto.fechar_tarea)
app.post('/api/proyecto/get_dato_fase', dbProyecto.get_dato_fase)
app.post('/api/proyecto/getusuarioproyecto', dbProyecto.getusuarioproyecto)
app.post('/api/proyecto/guardarusuarioproyecto', dbProyecto.guardarusuarioproyecto)
app.post('/api/proyecto/get_xls_formato_perfil', dbProyecto.get_xls_formato_perfil)
app.post('/api/proyecto/get_xls_formato_diseno', dbProyecto.get_xls_formato_diseno)
app.post('/api/proyecto/get_xls_formato_ejecucion', dbProyecto.get_xls_formato_ejecucion)
app.post('/api/proyecto/get_xls_formato_cierre', dbProyecto.get_xls_formato_cierre)
app.post('/api/proyecto/get_xls_formato_proyecto', dbProyecto.get_xls_formato_proyecto)
app.post('/api/proyecto/get_xls_formato_otros', dbProyecto.get_xls_formato_otros)
app.post('/api/proyecto/get_xls_formato_obra', dbProyecto.get_xls_formato_obra)
app.post('/api/proyecto/save_tarea_proyecto_individual', dbProyecto.save_tarea_proyecto_individual)
app.post('/api/proyecto/delete_tarea_proyecto_individual', dbProyecto.delete_tarea_proyecto_individual)
app.post('/api/proyecto/get_dato_fase_historico', dbProyecto.get_dato_fase_historico)
app.post('/api/proyecto/get_datoadicional_registro', dbProyecto.get_datoadicional_registro)
app.post('/api/proyecto/get_situacion', dbProyecto.get_situacion)
app.post('/api/proyecto/save_situacion', dbProyecto.save_situacion)
app.post('/api/proyecto/get_xls_formato_obra_valorizacioncontractual', dbProyecto.get_xls_formato_obra_valorizacioncontractual)
app.post('/api/proyecto/get_xls_formato_obra_presupuestoobra', dbProyecto.get_xls_formato_obra_presupuestoobra)
app.post('/api/proyecto/get_xls_formato_obra_avanceprogramadovsrealejectutado', dbProyecto.get_xls_formato_obra_avanceprogramadovsrealejectutado)
app.post('/api/proyecto/get_xls_formato_obra_valorizacionmayoresmetrados', dbProyecto.get_xls_formato_obra_valorizacionmayoresmetrados)
app.post('/api/proyecto/get_xls_formato_obra_valorizacionpartidasadicionales', dbProyecto.get_xls_formato_obra_valorizacionpartidasadicionales)
app.post('/api/proyecto/get_xls_formato_obra_adelantomateriales', dbProyecto.get_xls_formato_obra_adelantomateriales)
app.post('/api/proyecto/get_xls_formato_obra_ampliacionplazo', dbProyecto.get_xls_formato_obra_ampliacionplazo)
app.post('/api/proyecto/save_orden', dbProyecto.save_orden)
app.post('/api/proyecto/get_xls_formato_supervision', dbProyecto.get_xls_formato_supervision)
app.post('/api/proyecto/get_xls_formato_supervision_avanceprogramadovsrealejecutado', dbProyecto.get_xls_formato_supervision_avanceprogramadovsrealejecutado)
app.post('/api/proyecto/get_xls_formato_supervision_valorizacioncontractual', dbProyecto.get_xls_formato_supervision_valorizacioncontractual)
app.post('/api/proyecto/get_xls_formato_supervision_mayorprestacion', dbProyecto.get_xls_formato_supervision_mayorprestacion)
app.post('/api/proyecto/get_xls_formato_supervision_prestacionadicional', dbProyecto.get_xls_formato_supervision_prestacionadicional)
app.post('/api/proyecto/get_xls_formato_supervision_presupuestoobra', dbProyecto.get_xls_formato_supervision_presupuestoobra)
app.post('/api/proyecto/get_xls_formato_obra_supervision_garantias', dbProyecto.get_xls_formato_obra_supervision_garantias)
app.post('/api/proyecto/get_cartafianza', dbProyecto.get_cartafianza)
app.post('/api/proyecto/get_tipocarta', dbProyecto.get_tipocarta)
app.post('/api/proyecto/save_cartafianza', dbProyecto.save_cartafianza)
app.post('/api/proyecto/delete_cartafianza', dbProyecto.delete_cartafianza)
app.post('/api/proyecto/get_exportalldata', dbProyecto.get_exportalldata)
app.post('/api/proyecto/delete_situacion', dbProyecto.delete_situacion)
app.post('/api/proyecto/get_xls_formato_otros_amp_plazo', dbProyecto.get_xls_formato_otros_amp_plazo)
app.post('/api/proyecto/get_xls_formato_otros_mod_presupuestal', dbProyecto.get_xls_formato_otros_mod_presupuestal)
app.post('/api/proyecto/get_xls_formato_otros_adel_directo', dbProyecto.get_xls_formato_otros_adel_directo)
app.post('/api/proyecto/get_xls_formato_otros_adel_materiales', dbProyecto.get_xls_formato_otros_adel_materiales)
app.post('/api/proyecto/get_xls_formato_otros_emple_generados', dbProyecto.get_xls_formato_otros_emple_generados)
app.post('/api/proyecto/uploadfile', function (req, res) {
  let proyecto = req.query.proyecto;
  let dir = __dirname.replace('\dal', '') + "/archivos/proyectos/" + proyecto + "/";
  //let c_nombre = 'DA-' + Date.now() + '.' + req.query.extension;
  let c_nombre =   req.query.extension;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
  }

  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;
  upload(req, res, function (err) {

    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {

      res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: c_nombre })
    }
  });
})
app.post('/api/proyecto/get_exportalldata2', dbProyecto.get_exportalldata2);
app.post('/api/proyecto/getubigeoproyecto', dbProyecto.getUbigeoProyecto);
app.post('/api/proyecto/get_exportdatosadicionales', dbProyecto.get_exportdatosadicionales);
app.post('/api/proyecto/getubigeoproyecto_xls', dbProyecto.getUbigeoProyecto_xls);

/* Tipo Proyecto */
app.post('/api/tipoproyecto/get', dbTipoProyecto.get)
app.post('/api/tipoproyecto/save', dbTipoProyecto.save)
app.post('/api/tipoproyecto/delete_tipoproyecto', dbTipoProyecto.delete_tipoproyecto)

/* Tarea */
app.post('/api/tarea/get', dbTarea.get)
app.post('/api/tarea/get_fase', dbTarea.get_fase)
app.post('/api/tarea/get_actividad', dbTarea.get_actividad)
app.post('/api/tarea/get_tarea', dbTarea.get_tarea)
app.post('/api/tarea/get_datoadicional', dbTarea.get_datoadicional)

app.post('/api/tarea/save_tipoproyecto_tarea', dbTarea.save_tipoproyecto_tarea)
app.post('/api/tarea/save_fase', dbTarea.save_fase)
app.post('/api/tarea/save_actividad', dbTarea.save_actividad)
app.post('/api/tarea/save_tarea', dbTarea.save_tarea)
app.post('/api/tarea/save_datoadicional_tarea', dbTarea.save_datoadicional_tarea)
app.post('/api/tarea/delete_actividad', dbTarea.delete_actividad)
app.post('/api/tarea/delete_tarea', dbTarea.delete_tarea)
app.post('/api/tarea/delete_fase', dbTarea.delete_fase)

/* Ubigeo */
app.post('/api/ubigeo/get_ubigeoproyecto', dbUbigeo.get_ubigeoproyecto)
app.post('/api/ubigeo/get_departamento', dbUbigeo.get_departamento)
app.post('/api/ubigeo/get_provincia', dbUbigeo.get_provincia)
app.post('/api/ubigeo/get_distrito', dbUbigeo.get_distrito)
app.post('/api/ubigeo/get_centropoblado', dbUbigeo.get_centropoblado)

app.post('/api/ubigeo/save_proyectoubicacion', dbUbigeo.save_proyectoubicacion)
app.post('/api/ubigeo/get_ubigeoproyecto_fase', dbUbigeo.get_ubigeoproyecto_fase)
app.post('/api/ubigeo/get_ubigeobolsaproyecto', dbUbigeo.get_ubigeobolsaproyecto)
app.post('/api/ubigeo/save_bolsaproyectoubicacion', dbUbigeo.save_bolsaproyectoubicacion)
app.post('/api/ubigeo/save_proyectoubicacion_import', dbUbigeo.save_proyectoubicacion_import)


//app.post('/api/tipoproyecto/save', dbTipoProyecto.save)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
// Hola Soy el primer COmmit
// Cambio 2

// Hola Fer, Trabaja!!

