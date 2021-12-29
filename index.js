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
app.post('/api/AdmArchivos/getCarpetas',bdArchivos.getCarpetas) 
app.post('/api/AdmArchivos/saveCarpeta',bdArchivos.saveCarpeta) 
app.post('/api/AdmArchivos/deleteCarpeta',bdArchivos.deleteCarpeta)
app.post('/api/AdmArchivos/uploadfile', function (req, res) {
  let archivo = req.query.archivo;
  let rutaCorta =  "/Carpeta/" + archivo + "/";
  let dir = __dirname.replace('\dal', '') + ruta+rutaCorta;
  let c_nombre = req.query.extension;

  if (!fs.existsSync(dir)) {
    
    fs.mkdirSync(dir, 0744);
  }
  
  req.query.c_ruta = dir;
  req.query.c_nombre = c_nombre;
  dir = dir + '' + c_nombre;
  rutaCorta = rutaCorta + '' + c_nombre;

  upload(req, res, function (err) {
    if (err) {
      res.status(200).json({ estado: false, mensaje: "No se pudo cargar el archivo: " + err.stack, data: null })
    } else {
      res.status(200).json({ estado: true, mensaje: "Archivo cargado", c_ruta: rutaCorta, c_nombre: c_nombre  })
    }
  });
}) 
app.post('/api/AdmArchivos/saveArchivo',bdArchivos.saveArchivo) 
app.post('/api/AdmArchivos/deleteArchivo',bdArchivos.deleteArchivo)

app.get("/api/AdmArchivos/downloadArchivo", (req, res) => {
  let rutaarchivo = __dirname + ruta+ req.query.c_ruta;
  console.log(rutaarchivo);
  const file = path.resolve('', rutaarchivo);
  res.download(file);
})

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


