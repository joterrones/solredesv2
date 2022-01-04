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

const bdAlmacen = require('./dal/almacen')
const bdArchivos = require('./dal/AdmArchivos')
const bdConfiguracionGeneral = require('./dal/configuracionGeneral')

const app = express()
const port = 3400

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
app.post('/api/seguridad/getrole', dbSeguridad.getrole)
app.post('/api/seguridad/save', dbSeguridad.save)
app.post('/api/seguridad/resetearclave', dbSeguridad.resetearclave)
app.post('/api/seguridad/delete_usuario', dbSeguridad.delete_usuario)
app.post('/api/seguridad/saveRol', dbSeguridad.saveRol)
app.post('/api/seguridad/deleteRol',dbSeguridad.deleteRol) 
app.post('/api/seguridad/getProyectos',dbSeguridad.getProyectos) 
app.post('/api/seguridad/getUserPro',dbSeguridad.getUserPro) 
app.post('/api/seguridad/saveUserPro',dbSeguridad.saveUserPro) 
app.post('/api/seguridad/resetUserPro',dbSeguridad.resetUserPro)

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
app.post('/api/configuracionGeneral/getProyectos',bdConfiguracionGeneral.getProyectos) 
app.post('/api/configuracionGeneral/getTraGrupos',bdConfiguracionGeneral.getTraGrupos) 
app.post('/api/configuracionGeneral/savetraGrupos',bdConfiguracionGeneral.savetraGrupos) 
app.post('/api/configuracionGeneral/deletetraGrupos',bdConfiguracionGeneral.deletetraGrupos) 
app.post('/api/configuracionGeneral/getProUser',bdConfiguracionGeneral.getProUser) 
app.post('/api/configuracionGeneral/resetProUser',bdConfiguracionGeneral.resetProUser) 
app.post('/api/configuracionGeneral/saveProUser',bdConfiguracionGeneral.saveProUser)


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
  let rutaCorta =  "/imgDetalleguia/" + detalleguia + "/";
  let dir = __dirname.replace('\dal', '') + ruta+rutaCorta;
  let c_nombre = req.query.extension;

  if (!fs.existsSync(dir)) {
    
    fs.mkdirSync(dir, 0744);
  }
  
  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;
  rutaCorta = rutaCorta + '' + c_nombre;

  console.log("Ruta",dir);
  console.log("nombre",c_nombre);
  upload(req, res, function (err) {
    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {
      res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: rutaCorta, c_nombreImg: c_nombre  })
    }
  });
}) 
app.post('/api/almacen/saveImgDetalleGuia',bdAlmacen.saveImgDetalleGuia)


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

/* General 
app.post('/api/general/get', dbGeneral.get)
app.post('/api/general/save', dbGeneral.save)
app.post('/api/general/get_feriado', dbGeneral.get_feriado)
app.post('/api/general/save_feriado', dbGeneral.save_feriado)

app.post('/api/general/getdepartamento', dbGeneral.getdepartamento)
app.post('/api/general/getprovincia', dbGeneral.getprovincia)
app.post('/api/general/getdistrito', dbGeneral.getdistrito)
app.post('/api/general/getcentropoblado', dbGeneral.getcentropoblado)
*/

/* Mapa 
app.post('/api/mapa/get', dbMapa.get)
app.post('/api/mapa/getxls', dbMapa.getxls)
app.post('/api/mapa/getfiles', dbMapa.getfiles)
app.post('/api/mapa/get_proyecto_atributo', dbMapa.get_proyecto_atributo)
app.post('/api/mapa/gettareasincompletas', dbMapa.gettareasincompletas)
*/

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
app.post('/api/inportacion/insertplanilla', dbImportacion.insertplanilla);


//app.post('/api/tipoproyecto/save', dbTipoProyecto.save)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


