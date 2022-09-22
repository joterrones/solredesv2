const express = require('express')
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var cors = require('cors');
var multer = require('multer');
const fs = require('fs'); 
var path = require('path')
const dbSeguridad = require('./dal/seguridad')
const dbImportacion = require('./dal/importacion')
const dbProyecto = require('./dal/proyecto')
const dbMapa = require('./dal/mapa')
const bdReporte = require('./dal/reporte')
const bdAlmacen = require('./dal/almacen')
const bdArchivos = require('./dal/admarchivos')
const bdConfiguracionGeneral = require('./dal/configuraciongeneral')
const dbElemento = require('./dal/elemento')
const dbGeneral = require('./dal/general')
const dbArmado = require('./dal/armado')
const dbMetrado = require('./dal/metrado')
const dbDashboard = require('./dal/dashboard')
const dbMovil = require('./dal/movil')
const dbFicha = require('./dal/ficha')
const dbExportar = require('./dal/exportar')
const app = express()
const port = 3200

const ruta = '/archivos';

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

app.use('/archivos', express.static(__dirname + ruta));

/* Seguridad */
app.post('/api/seguridad/login', dbSeguridad.login)
app.post('/api/seguridad/get', dbSeguridad.get)
app.post('/api/seguridad/getUserSinAsignacion',dbSeguridad.getUserSinAsignacion)
app.post('/api/seguridad/getrole', dbSeguridad.getrole) 
app.post('/api/seguridad/getRolUser', dbSeguridad.getRolUser)
app.post('/api/seguridad/validarDatos', dbSeguridad.validarDatos)
app.post('/api/seguridad/saveUser', dbSeguridad.saveUser)
app.post('/api/seguridad/resetearclave', dbSeguridad.resetearclave)
app.post('/api/seguridad/delete_usuario', dbSeguridad.delete_usuario) 
app.post('/api/seguridad/estadoUser', dbSeguridad.estadoUser)
app.post('/api/seguridad/saveRol', dbSeguridad.saveRol)
app.post('/api/seguridad/deleteRol',dbSeguridad.deleteRol) 
app.post('/api/seguridad/getProyectos',dbSeguridad.getProyectos) 
app.post('/api/seguridad/getUserPro',dbSeguridad.getUserPro) 
app.post('/api/seguridad/saveUserPro',dbSeguridad.saveUserPro) 
app.post('/api/seguridad/resetUserPro',dbSeguridad.resetUserPro) 
app.post('/api/seguridad/getPantallaRol',dbSeguridad.getPantallaRol) 
app.post('/api/seguridad/getPantalla',dbSeguridad.getPantalla) 
app.post('/api/seguridad/updatePantallaRol',dbSeguridad.updatePantallaRol)
app.post('/api/seguridad/getDataUserPro',dbSeguridad.getDataUserPro) 

/*Configuracion General */
app.post('/api/configuracionGeneral/getempresa',bdConfiguracionGeneral.getempresa)
app.post('/api/configuracionGeneral/saveEmpresa',bdConfiguracionGeneral.saveEmpresa) 
app.post('/api/configuracionGeneral/deleteEmpresa',bdConfiguracionGeneral.deleteEmpresa)
app.post('/api/configuracionGeneral/saveLinea',bdConfiguracionGeneral.saveLinea)
app.post('/api/configuracionGeneral/getLinea',bdConfiguracionGeneral.getLinea)

app.post('/api/configuracionGeneral/deleteLinea',bdConfiguracionGeneral.deleteLinea) 
app.post('/api/configuracionGeneral/estadoLinea',bdConfiguracionGeneral.estadoLinea)
app.post('/api/configuracionGeneral/gettipolinea',bdConfiguracionGeneral.gettipolinea) 
app.post('/api/configuracionGeneral/saveTipoLinea',bdConfiguracionGeneral.saveTipoLinea) 
app.post('/api/configuracionGeneral/deleteTipoLinea',bdConfiguracionGeneral.deleteTipoLinea)
app.post('/api/configuracionGeneral/getZona',bdConfiguracionGeneral.getZona) 
app.post('/api/configuracionGeneral/getZonas',bdConfiguracionGeneral.getZonas)
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
app.post('/api/configuracionGeneral/getValoresGnr',bdConfiguracionGeneral.getValoresGnr) 
app.post('/api/configuracionGeneral/saveValoresGnr',bdConfiguracionGeneral.saveValoresGnr) 
app.post('/api/configuracionGeneral/deleteValorGnr',bdConfiguracionGeneral.deleteValorGnr) 
app.post('/api/configuracionGeneral/getTraGrupos',bdConfiguracionGeneral.getTraGrupos) 
app.post('/api/configuracionGeneral/savetraGrupos',bdConfiguracionGeneral.savetraGrupos) 
app.post('/api/configuracionGeneral/deletetraGrupos',bdConfiguracionGeneral.deletetraGrupos) 
app.post('/api/configuracionGeneral/getProUser',bdConfiguracionGeneral.getProUser) 
app.post('/api/configuracionGeneral/resetProUser',bdConfiguracionGeneral.resetProUser) 
app.post('/api/configuracionGeneral/saveProUser',bdConfiguracionGeneral.saveProUser) 
app.post('/api/configuracionGeneral/denegarAllProuser',bdConfiguracionGeneral.denegarAllProuser)
app.post('/api/configuracionGeneral/getLineaUser',bdConfiguracionGeneral.getLineaUser)
app.post('/api/configuracionGeneral/noAsignarLineaUser',bdConfiguracionGeneral.noAsignarLineaUser)
app.post('/api/configuracionGeneral/asignarLineaUser',bdConfiguracionGeneral.asignarLineaUser) 
app.post('/api/configuracionGeneral/getTipoElemento',bdConfiguracionGeneral.getTipoElemento)
app.post('/api/configuracionGeneral/saveTipoElemento',bdConfiguracionGeneral.saveTipoElemento)
app.post('/api/configuracionGeneral/deleteTipoElemento',bdConfiguracionGeneral.deleteTipoElemento)
app.post('/api/configuracionGeneral/getTablaCateTipoMontaje',bdConfiguracionGeneral.getTablaCateTipoMontaje)
app.post('/api/configuracionGeneral/saveCateTipoMontaje',bdConfiguracionGeneral.saveCateTipoMontaje)
app.post('/api/configuracionGeneral/deleteCateTipoMontaje',bdConfiguracionGeneral.deleteCateTipoMontaje)  
app.post('/api/configuracionGeneral/uploadfile', function (req, res) {
  let archivo = req.query.archivo;

  let rutaCorta = archivo + "/Img/";
  let dir = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta;
  let c_nombre = req.query.extension;


  if (!fs.existsSync( __dirname.replace('\dal', '')+ruta+"/"+archivo)) {    
    fs.mkdirSync(__dirname.replace('\dal', '')+ruta+"/"+archivo, 0744);
  }
  
  if(!fs.existsSync( dir )) {
    fs.mkdirSync(dir, 0744);
  }
  
  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;

  upload(req, res, function (err) {
    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {  
      checksum.file(dir, function (err, sum) {        
       
        nuevoNombreArchivo = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta+sum+path.extname(c_nombre);
        fs.rename(dir, nuevoNombreArchivo, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
        newRuta = rutaCorta+sum+path.extname(c_nombre);
        res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: newRuta, c_nombre: c_nombre, c_checksum: sum+path.extname(c_nombre) });
       
      })
    }
  });
}) 
app.post('/api/configuracionGeneral/saveProImg',bdConfiguracionGeneral.saveProImg)    
app.post('/api/configuracionGeneral/saveProImgLogo',bdConfiguracionGeneral.saveProImgLogo) 
app.post('/api/configuracionGeneral/saveColorPro',bdConfiguracionGeneral.saveColorPro)
app.post('/api/configuracionGeneral/getTipoMontaje',bdConfiguracionGeneral.getTipoMontaje)
app.post('/api/configuracionGeneral/saveTipoMontaje',bdConfiguracionGeneral.saveTipoMontaje)
app.post('/api/configuracionGeneral/deleteTipoMontaje',bdConfiguracionGeneral.deleteTipoMontaje) 
app.post('/api/configuracionGeneral/getVersion',bdConfiguracionGeneral.getVersion) 
app.post('/api/configuracionGeneral/saveVersion',bdConfiguracionGeneral.saveVersion)
app.post('/api/configuracionGeneral/deleteVersion',bdConfiguracionGeneral.deleteVersion)  
app.post('/api/configuracionGeneral/getDetalleVersion',bdConfiguracionGeneral.getDetalleVersion) 
app.post('/api/configuracionGeneral/saveDetalleVersion',bdConfiguracionGeneral.saveDetalleVersion) 
app.post('/api/configuracionGeneral/deleteDetalleVersion',bdConfiguracionGeneral.deleteDetalleVersion) 
app.post('/api/configuracionGeneral/getVersiones',bdConfiguracionGeneral.getVersiones) 
app.post('/api/configuracionGeneral/getNotificacion',bdConfiguracionGeneral.getNotificacion) 
app.post('/api/configuracionGeneral/getNotificacionDetalle',bdConfiguracionGeneral.getNotificacionDetalle) 
app.post('/api/configuracionGeneral/showNotificacion',bdConfiguracionGeneral.showNotificacion) 
app.post('/api/configuracionGeneral/getMonInspeccionPopup',bdConfiguracionGeneral.getMonInspeccionPopup) 
app.post('/api/configuracionGeneral/getinspeccionxlspopup',bdConfiguracionGeneral.getinspeccionxlspopup) 
app.post('/api/configuracionGeneral/getAlmacenPopup',bdConfiguracionGeneral.getAlmacenPopup)


/*Almacen */
app.post('/api/almacen/getAlmacen',bdAlmacen.getAlmacen) 
app.post('/api/almacen/getAlmacenes',bdAlmacen.getAlmacenes)
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
  let rutaCorta =  "/imgDetalleguia/" + detalleguia + "/";
  let dir = __dirname.replace('\dal', '') + ruta+rutaCorta;
  let c_nombre = req.query.extension;

  if (!fs.existsSync( __dirname.replace('\dal', '')+ruta+"/"+detalleguia)) {    
    fs.mkdirSync(__dirname.replace('\dal', '')+ruta+"/"+detalleguia, 0744);
    fs.mkdirSync(dir, 0744);
  }

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
      checksum.file(dir, function (err, sum) {        
        console.log("Ruta check: ",dir);
        console.log(sum);
        nuevoNombreArchivo = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta+sum+path.extname(c_nombre);
        console.log("nuevoNombreArchivo: "+nuevoNombreArchivo);
        fs.rename(dir, nuevoNombreArchivo, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
        newRuta = rutaCorta+sum+path.extname(c_nombre);
        res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: newRuta, c_nombre: c_nombre, c_checksum: sum+path.extname(c_nombre) });
        console.log("ERror",err)
      })

    }
  });
}) 
app.post('/api/almacen/saveImgDetalleGuia',bdAlmacen.saveImgDetalleGuia)
app.post('/api/almacen/savePeriodo',bdAlmacen.savePeriodo) 
app.post('/api/almacen/deletePeriodo',bdAlmacen.deletePeriodo)


/* Gestion de archivos */
app.post('/api/AdmArchivos/getArchivo',bdArchivos.getArchivo) 
app.post('/api/AdmArchivos/saveArchivo',bdArchivos.saveArchivo) 
app.post('/api/AdmArchivos/deleteArchivo',bdArchivos.deleteArchivo) 
app.post('/api/AdmArchivos/getCarpetas',bdArchivos.getCarpetas) 
//--------------------------------------------
var checksum = require('checksum')
//--------------------------------------------
app.post('/api/AdmArchivos/uploadfile', function (req, res) {
  let archivo = req.query.archivo;
  console.log(archivo)
  let rutaCorta = archivo + "/Documentos/";
  let dir = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta;
  let c_nombre = req.query.extension;
  console.log(dir)

  if (!fs.existsSync( __dirname.replace('\dal', '')+ruta+"/"+archivo)) {    
    fs.mkdirSync(__dirname.replace('\dal', '')+ruta+"/"+archivo, 0744);
    fs.mkdirSync(dir, 0744);
  }
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, 0744);
  }
  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {  
      checksum.file(dir, function (err, sum) {        
        console.log("Ruta check: ",dir);
        console.log(sum);
        nuevoNombreArchivo = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta+sum+path.extname(c_nombre);
        fs.rename(dir, nuevoNombreArchivo, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
        newRuta = rutaCorta+sum+path.extname(c_nombre);
        res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: newRuta, c_nombre: c_nombre, c_checksum: sum+path.extname(c_nombre) });
        console.log("ERror",err)
      })
    }
  });
})
app.get("/api/AdmArchivos/downloadArchivo", (req, res) => {
  let rutaarchivo = __dirname + ruta+ "/" +req.query.c_ruta;
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})

/* General */
app.post('/api/general/get', dbGeneral.get)
app.post('/api/general/getzona', dbGeneral.getzona)
app.post('/api/general/gettipolinea', dbGeneral.gettipolinea)
app.post('/api/general/getlinea', dbGeneral.getlinea)

/* Armado */
app.post('/api/armado/get', dbArmado.get)
app.post('/api/armado/insert',dbArmado.insert)
app.post('/api/armado/deleteArmado', dbArmado.deleteArmado)
app.post('/api/armado/gettipoarmado', dbArmado.gettipoarmado)
app.post('/api/armado/getversion', dbArmado.getversion)
app.post('/api/armado/getconfigarmado', dbArmado.getconfigarmado)
app.post('/api/armado/insertconfigarmado', dbArmado.insertconfigarmado)
app.post('/api/armado/getconfigtipomontaje', dbArmado.getconfigtipomontaje)
app.post('/api/armado/insertarmadoconfigmontaje', dbArmado.insertarmadoconfigmontaje) 
app.post('/api/armado/uploadfile', function (req, res) {
  let archivo = req.query.archivo;
  let rutaCorta = archivo+"/Documentos/";
  let dir = __dirname.replace('\dal', '') + ruta+"/"+rutaCorta;
  let c_nombre = req.query.extension;

  if (!fs.existsSync( __dirname.replace('\dal', '')+ruta+"/"+archivo)) {    
    fs.mkdirSync(__dirname.replace('\dal', '')+ruta+"/"+archivo, 0744);
  }
  
  if (!fs.existsSync(dir)) {    
    fs.mkdirSync(dir, 0744);
  }
  
  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + c_nombre;

  console.log("Ruta",dir);
  console.log("nombre",c_nombre);
  upload(req, res, function (err) {
    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {
      checksum.file(dir, function (err, sum) {        
        console.log("Ruta check: ",dir);
        console.log(sum);
        nuevoNombreArchivo = __dirname.replace('\dal', '')+ruta+"/"+rutaCorta+sum+path.extname(c_nombre);
        fs.rename(dir, nuevoNombreArchivo, function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
        newRuta = rutaCorta+sum+path.extname(c_nombre);
        res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: newRuta, c_nombre: c_nombre, c_checksum: sum+path.extname(c_nombre) });
        console.log("ERror",err)
      })
    }
  });
})

//REPORTE ******
app.post('/api/reporte/getReporte',bdReporte.getReporte) 
app.post('/api/reporte/getReporteCabecero',bdReporte.getReporteCabecero)
app.post('/api/reporte/getZonasProyectos',bdReporte.getZonasProyectos)
app.post('/api/reporte/saveReporteCabecero',bdReporte.saveReporteCabecero)
app.post('/api/reporte/deleteReporteCabecero',bdReporte.deleteReporteCabecero)
app.post('/api/reporte/saveReporte',bdReporte.saveReporte)
app.post('/api/reporte/deleteReporte',bdReporte.deleteReporte)
app.post('/api/reporte/getPeriodos',bdReporte.getPeriodos)



/* Metrado */
app.post('/api/metrado/get', dbMetrado.get)
app.post('/api/metrado/getmontaje', dbMetrado.getmontaje)
app.post('/api/metrado/gettipolinea', dbMetrado.gettipolinea)
app.post('/api/metrado/getestructurametrado', dbMetrado.getestructurametrado)


app.get("/api/mapa/download", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/' + req.query.nombre;
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})

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

app.post('/api/proyecto/get_seleccionproyecto', dbProyecto.get_seleccionproyecto);
app.post('/api/importacion/insertplanilla', dbImportacion.insertplanilla);
app.post('/api/importacion/insertlinea', dbImportacion.insertlinea); 
app.post('/api/importacion/creargeom', dbImportacion.creargeom);
app.post('/api/importacion/insertSuministro', dbImportacion.insertSuministro); 
app.post('/api/importacion/insertMontaje', dbImportacion.insertMontaje); 
app.post('/api/importacion/deleteEstructLinea', dbImportacion.deleteEstructLinea); 
app.post('/api/importacion/deleteAllEstructLinea', dbImportacion.deleteAllEstructLinea);
app.post('/api/importacion/orientacionautomatica', dbImportacion.orientacionautomatica); 
app.post('/api/importacion/gettipolinea', dbImportacion.gettipolinea);

app.get("/api/importacion/downloadPlantillaSuministro", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/plantillas/Cargar_Elemento.xlsx' ;
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})
app.get("/api/importacion/downloadPlantillaMontaje", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/plantillas/Cargar_Montaje.xlsx';
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})
app.get("/api/importacion/downloadPlantillaLinea", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/plantillas/Cargar_Linea.xlsx';
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})
app.get("/api/importacion/downloadPlantillaRedes", (req, res) => {
  let rutaarchivo = __dirname + ruta + '/plantillas/Carga_Redes.xlsx'; 
  
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  
  res.download(file);
})

/* Mapa*/
app.post('/api/mapa/get', dbMapa.get);
app.post('/api/mapa/getlineas', dbMapa.getlineas);
app.post('/api/mapa/getdetalle', dbMapa.getdetalle); 
app.post('/api/mapa/getdetallemon', dbMapa.getdetallemon); 
app.post('/api/mapa/getestructura', dbMapa.getestructura);
app.post('/api/mapa/buscarLinea', dbMapa.buscarLinea);
app.post('/api/mapa/insertOrientacion', dbMapa.insertOrientacion); 
app.post('/api/mapa/buscarEstruct', dbMapa.buscarEstruct); 
app.post('/api/mapa/getZona', dbMapa.getZona);
app.post('/api/mapa/gettipolinea', dbMapa.gettipolinea);
app.post('/api/mapa/getLinea', dbMapa.getLinea);
app.post('/api/mapa/getLineaFiltro',dbMapa.getLineaFiltro)
app.post('/api/mapa/getestructura2', dbMapa.getestructura2);
app.post('/api/mapa/getMonInspeccion', dbMapa.getMonInspeccion); 
app.post('/api/mapa/getLineasMon', dbMapa.getLineasMon);
app.post('/api/mapa/getinspeccionxls', dbMapa.getinspeccionxls);
app.post('/api/mapa/getUsers', dbMapa.getUsers);
app.post('/api/mapa/getTipoLineaMon', dbMapa.getTipoLineaMon); 
app.post('/api/mapa/getZonaMon', dbMapa.getZonaMon);  
app.post('/api/mapa/saveMon', dbMapa.saveMon); 
app.post('/api/mapa/getObservaciones', dbMapa.getObservaciones); 
app.post('/api/mapa/saveObservacion', dbMapa.saveObservacion); 
app.post('/api/mapa/saveGenObservacion', dbMapa.saveGenObservacion);


/* Movil */
app.get('/api/movil/getusuario', dbMovil.getusuario)
app.get('/api/movil/getlinea', dbMovil.getlinea)
app.get('/api/movil/getdato', dbMovil.getdato)
//app.post('/api/movil/guardardatos', dbMovil.guardardatos)
app.post('/api/movil/guardarfoto', dbMovil.guardarfoto)
app.post('/api/movil/guardardatosalmacen', dbMovil.guardardatosalmacen)
app.post('/api/movil/guardarfotoalmacen', dbMovil.guardarfotoalmacen)


/*app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})*/


/*Elemento*/
app.post('/api/elemento/get', dbElemento.get)
app.post('/api/elemento/updateconfig', dbElemento.updateconfig) 
app.post('/api/elemento/getTipoElemento', dbElemento.getTipoElemento)

/* Dashboard */
app.post('/api/dashboard/getLineas', dbDashboard.getLineas) 
app.post('/api/dashboard/getMonInspecion', dbDashboard.getMonInspecion) 
app.post('/api/dashboard/getDatosGuia', dbDashboard.getDatosGuia)

/*Ficha */
app.post('/api/ficha/get', dbFicha.get)
app.post('/api/ficha/getFoto', dbFicha.getFoto)

/*Exportar*/
app.post('/api/exportar/exportar', dbExportar.exportar)

const options = {
  cors: {
    origin: 'http://localhost:4200',
  },
};

const server = require('http').Server(app);
const io = require('socket.io')(server, options);

const cnx = require('./common/appsettings');
const valida = require('./common/validatoken');
let pool = cnx.pool;

io.on('connection', function (socket) {
  const handshake = socket.id;
  let  nameRoom  = socket.handshake.query;

  console.log(handshake);
  console.log(nameRoom);  

  socket.join(nameRoom)
  /*socket.on('evento', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
    socket.to(nameRoom).emit('evento', res);    
  })*/

  app.post('/api/movil/guardardatos', async (request, response) => {
    console.log("request.body", request.body);
    let inspecciones = request.body.inspecciones;
    console.log("inspecciones", inspecciones);
    let resultados = [];
    let cadena_inspeccion = '';
    let resultado;
    inspecciones.forEach(async element => {
        try {
            let queryExisteInspeccion = await pool.query('Select n_idmon_inspeccion from mon_inspeccion where c_codigo = $1 and n_borrado=0', [element.c_codigo]);
            if (queryExisteInspeccion.rowCount == 0) {

                if (!element.n_altitud) {
                    element.n_altitud = 0;
                }

                if (!element.n_precision) {
                    element.n_precision = 0;
                }
                
                element.n_modulo= element.n_modulo===undefined?0:element.n_modulo;

                cadena_inspeccion = 'insert into mon_inspeccion(n_idmon_inspeccion,c_codigo,c_latitud,c_longitud,n_precision,n_altitud,d_fecha,n_idpl_linea,n_tipoapp,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                    '(default,\'' + element.c_codigo + '\',\'' + element.c_latitud + '\',\'' + element.c_longitud + '\',' + element.n_precision + ',' + element.n_altitud + ',to_timestamp(\'' + element.d_fecha + '\',\'yyyy/mm/dd HH24:MI:SS\'),'+element.n_idpl_linea+','+element.n_modulo+',0,' + element.n_id_usuario + ',now()) returning *';
                console.log("cadena_inspeccion", cadena_inspeccion);
                let insertInspeccion = await pool.query(cadena_inspeccion);
                if (insertInspeccion.rowCount > 0) {

                    if (element.vanos) {
                        if (element.vanos.length > 0) {
                            let cadena_vano = 'insert into mon_inspeccionvano(n_idmon_inspeccionvano,c_codigoinicio,c_codigofin,n_borrado,n_id_usercrea,d_fechacrea) values ';
                            element.vanos.forEach(vano => {
                                cadena_vano = cadena_vano + '(default,\'' + vano.c_codigoinicio + '\',\'' + vano.c_codigofin + '\'' + ',0,' + element.n_id_usuario + ',now()),';
                            });
                            cadena_vano = cadena_vano.substr(0, cadena_vano.length - 1) + ' returning *';
                            await pool.query(cadena_vano)
                        }
                    }

                    if (element.detallesInspeccion) {
                        if (element.detallesInspeccion.length > 0) {
                            let cadena_detalle = '';
                            await element.detallesInspeccion.forEach(async detalle => {
                                cadena_detalle = 'insert into mon_inspecciondetalle(n_idmon_inspecciondetalle,n_idmon_inspeccion,n_idpl_armado,n_cantidad,b_adicional,b_eliminado,c_observacion,n_orientacion,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                                    '(default,' + insertInspeccion.rows[0].n_idmon_inspeccion + ',' + detalle.n_idpl_armado + ',' + detalle.n_cantidad + ',' + detalle.b_adicional + ',' + detalle.b_eliminado + ',\'' + detalle.c_observacion + '\',' + detalle.n_orientacion + ',0,' + element.n_id_usuario + ',now()) returning *';
                                let insertDetalle = await pool.query(cadena_detalle);

                                if (detalle.observacionesInspeccion) {
                                    if (detalle.observacionesInspeccion.length > 0) {
                                        let cadena_observacion = 'insert into mon_inspeccionobservacion(n_idmon_inspeccionobservacion,n_idmon_inspecciondetalle,n_idgen_observacion,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                        detalle.observacionesInspeccion.forEach(observacion => {
                                            cadena_observacion = cadena_observacion + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',' + observacion.n_idgen_observacion + ',0,' + element.n_id_usuario + ',now()),';
                                        });
                                        cadena_observacion = cadena_observacion.substr(0, cadena_observacion.length - 1) + ' returning *';
                                        let insertObservacion = await pool.query(cadena_observacion)
                                    }
                                }

                                if (detalle.fotos) {
                                    if (detalle.fotos.length > 0) {
                                        let cadena_fotos = 'insert into mon_inspecciondetallefoto(n_idmon_inspecciondetallefoto,n_idmon_inspecciondetalle,c_nombre,n_idgen_tipofoto,b_estado,n_borrado,n_id_usercrea,d_fechacrea) values ';
                                        detalle.fotos.forEach(foto => {
                                            cadena_fotos = cadena_fotos + '(default,' + insertDetalle.rows[0].n_idmon_inspecciondetalle + ',\'' + foto.c_nombre + '\',' + foto.n_tipofoto + ',false,0,' + element.n_id_usuario + ',now()),';
                                        });
                                        cadena_fotos = cadena_fotos.substr(0, cadena_fotos.length - 1) + ' returning *';
                                        let insertFoto = await pool.query(cadena_fotos);
                                    }
                                }
                            });
                        }
                    }
                    resultado = {
                        c_codigo: element.c_codigo,
                        b_flag: true,
                        c_mensaje: "Registro guardado"
                    };
                }
            } else {
                resultado = {
                    c_codigo: element.c_codigo,
                    b_flag: false,
                    c_mensaje: "El registro ya existe"
                };
            }
        } catch (error) {
            resultado = {
                c_codigo: element.c_codigo,
                b_flag: false,
                c_mensaje: "Ocurrio un error al insertar los datos de inspeccion!." + error.stack
            };
        }
        resultados.push(resultado);
        if (inspecciones.length <= resultados.length) {            
            response.status(200).json({ inspecciones: resultados });
            let n_idpl_linea = inspecciones[0].n_idpl_linea;
            await pool.query('select p.n_idpro_proyecto from pro_proyecto p '+
                                'inner join pl_zona pz on pz.n_idpro_proyecto = p.n_idpro_proyecto and pz.n_borrado = 0 ' +
                                'inner join pl_linea pl on pl.n_idpl_zona = pz.n_idpl_zona and pl.n_borrado = 0 '+
                              'where p.n_borrado = 0 and pl.n_idpl_linea = $1', [n_idpl_linea],
            (error, results)=>{
              if (error) {
                console.log(error);  
              }
              else{
                let n_idpro_proyecto = results.rows[0].n_idpro_proyecto
                pool.query('select n_idseg_userprofile from seg_userprofile where n_borrado = 0 and b_activo = true and n_idseg_rol in (19,20,21,15,25) ',
                  (error, results) => {
                    if (error) {
                        console.log(error);                            
                    } else {
                      let n_insert = 0;
                        resultados.forEach(async e => {
                          if(e.b_flag){
                            n_insert++;
                          }
                        })    
                        if (n_insert > 0) {
                          results.rows.forEach(async element => {  
                            let n_idg_notificacion = 0;                                   
                              await pool.query('INSERT INTO g_notificacion(n_idg_notificacion, n_idseg_userprofile, c_detalle, b_estado, n_borrado, n_id_usercrea,  d_fechacrea, n_idpro_proyecto, b_almacen) ' +
                                      ' VALUES (default,'+ element.n_idseg_userprofile +', \'Se agregaron '+n_insert+' inspeccion(es)\', false, 0, '+ element.n_idseg_userprofile +', now(), '+n_idpro_proyecto+', false) returning n_idg_notificacion;',
                                (error, results) => {
                                  if (error) {
                                    console.log(error);    
                                  }else{
                                    n_idg_notificacion = results.rows[0].n_idg_notificacion
                                    resultados.forEach(async e => {
                                      if (e.b_flag) {
                                        await pool.query('INSERT INTO g_notificacionmon( \n\r' +
                                          ' n_idg_notificacionmon, n_idg_notificacion, c_codigo_mon, n_borrado, n_id_usercrea, d_fechacrea ) \n\r' +
                                          ' VALUES (default, '+n_idg_notificacion+', \''+e.c_codigo+'\', 0, '+ element.n_idseg_userprofile +', now()); ',
                                          (error, results) => {
                                            if (error) {
                                              console.log(error);    
                                            }else{
                                            }
                                          });
                                      }
                                    }); 
                                  }
                                });
                          });
                        }
                      console.log("resultado ------------------");
                      socket.to(nameRoom).emit('evento', 5);
                    }
                  }); 
              }
            })
            
        }
    });
  })

  app.post('/api/movil/guardardatosalmacen2', async (request, response) => {
    console.log("request.body", request.body);
    let guias = request.body.guias;
    console.log("guardardatosalmacen", guias);
    let resultados = [];
    let cadena_guia = '';
    let resultado;
    let insertguiaAux= [];
    guias.forEach(async element => {
        try {
            /* let queryExisteGuia = await pool.query('Select n_idalm_guia from alm_guia where c_codigo = $1 and n_borrado=0', [element.c_codigo]);
             if (queryExisteGuia.rowCount == 0) {*/

            if (!element.n_altitud) {
                element.n_altitud = 0;
            }

            if (!element.n_precision) {
                element.n_precision = 0;
            }

            cadena_guia = 'insert into alm_guia(n_idalm_guia,n_idalm_almacen,c_nombre,c_direccion,n_idgen_periodo,c_nroguia,c_ruc,c_observacion,b_aprobar,c_latitud,c_longitud,n_precision,n_altitud,d_fecha,n_borrado,n_id_usercrea,d_fechacrea) values ' +
                '(default,'
                + element.n_idalm_almacen + ',\''
                + element.c_nombre + '\',\''
                + element.c_direccion + '\','
                + element.n_idgen_periodo + ',\''
                + element.c_nroguia + '\',\''
                + element.c_ruc + '\',\''
                + element.c_observacion
                + '\',false,\''
                + element.c_latitud + '\',\''
                + element.c_longitud + '\','
                + element.n_precision + ','
                + element.n_altitud
                + ',to_timestamp(\'' + element.d_fecha + '\',\'yyyy/mm/dd HH24:MI:SS\'),0,'
                + element.n_id_usuario
                + ',now()) returning *';

            console.log("cadena_guia", cadena_guia);
            let insertguia = await pool.query(cadena_guia);
            if (insertguia.rowCount > 0) {
                insertguiaAux.push(insertguia.rows[0]);
                if (element.detalleguia != null && element.detallesguia.length > 0) {
                    let cadena_detallesguia = 'insert into alm_detalleguia(n_idalm_detalleguia,n_idalm_guia, n_idpl_elemento, n_cantidad ,n_borrado,n_id_usercrea,d_fechacrea) values ';
                    element.detallesguia.forEach(detalleguia => {
                        cadena_detallesguia = cadena_detallesguia + '(default,'
                            + insertguia.rows[0].n_idalm_guia + ','
                            + detalleguia.n_idpl_elemento + ','
                            + detalleguia.n_cantidad + ','
                            + ',0,'
                            + element.n_id_usuario
                            + ',now()),';
                    });
                    cadena_detallesguia = cadena_detallesguia.substr(0, cadena_detallesguia.length - 1) + ' returning *';
                    await pool.query(cadena_detallesguia)
                }
                resultado = {
                    c_codigo: element.c_codigo,
                    n_estado: 1,
                    c_mensaje: "Registro guardado"
                };
            }
            /*   } else {
                   resultado = {
                       c_codigo: element.c_codigo,
                       n_estado: 0,
                       c_mensaje: "El registro ya existe"
                   };
               }*/
        } catch (error) {
            resultado = {
                c_codigo: element.c_codigo,
                n_estado: 0,
                c_mensaje: "Ocurrio un error al insertar los datos del almacen!." + error.stack
            };
        }
        resultados.push(resultado);
        if (guias.length <= resultados.length) {
            response.status(200).json({ guias: resultados });
            let n_idalm_almacen = guias[0].n_idalm_almacen;
            await pool.query('select n_idpro_proyecto  from alm_almacen where n_idalm_almacen = $1', [n_idalm_almacen],
            (error, results)=>{
              if (error) {
                console.log(error);  
              }
              else{
                let n_idpro_proyecto = results.rows[0].n_idpro_proyecto
                pool.query('select n_idseg_userprofile from seg_userprofile where n_borrado = 0 and b_activo = true and n_idseg_rol in (19,20,21,15,25) ',
                  (error, results) => {
                    if (error) {
                        console.log(error);                            
                    } else {
                      let n_insert = 0;
                        resultados.forEach(async e => {
                          if(e.n_estado == 1){
                            n_insert++;
                          }
                        })    
                        if (n_insert > 0) {
                          results.rows.forEach(async element => {  
                            let n_idg_notificacion = 0;                                   
                              await pool.query('INSERT INTO g_notificacion(n_idg_notificacion, n_idseg_userprofile, c_detalle, b_estado, n_borrado, n_id_usercrea,  d_fechacrea, n_idpro_proyecto, b_almacen) ' +
                                      ' VALUES (default,'+ element.n_idseg_userprofile +', \'Se agregaron '+n_insert+' guía(s)\', false, 0, '+ element.n_idseg_userprofile +', now(), '+n_idpro_proyecto+', true) returning n_idg_notificacion;',
                                (error, results) => {
                                  if (error) {
                                    console.log(error);    
                                  }else{
                                    n_idg_notificacion = results.rows[0].n_idg_notificacion
                                    insertguiaAux.forEach(async e => {
                                      if (e.n_idalm_guia) {
                                        await pool.query('INSERT INTO g_notificacion_alm( \n\r' +
                                          ' n_idg_notificacion_alm, n_idg_notificacion, n_idalm_guia, n_borrado, n_id_usercrea, d_fechacrea) \n\r' +
                                          ' VALUES (default, '+n_idg_notificacion+', '+e.n_idalm_guia+', 0, '+ e.n_id_usercrea +', now()); ',
                                          (error, results) => {
                                            if (error) {
                                              console.log(error);    
                                            }else{
                                            }
                                          });
                                      }
                                    }); 
                                  }
                                });
                          });
                        }
                      console.log("resultado almacen------------------");
                      socket.to(nameRoom).emit('evento', 5);
                    }
                  }); 
              }
            })
        }
    });

})

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});

server.listen(port, function () {
  console.log('\n')
  console.log(`App running on port ${port}.`)
})

