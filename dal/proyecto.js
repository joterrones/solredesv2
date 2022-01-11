const cnx = require('../common/appsettings')
const valida = require('../common/validatoken')
let pool = cnx.pool;

const get_seleccionproyecto = (request, response) => {
    var obj = valida.validaToken(request)
    if (obj.estado) {
        let n_idseg_userprofile = request.body.n_idseg_userprofile;
        pool.query('    select p.n_idpro_proyecto, p.c_nombre, p.c_detalle, p.c_color, p.c_rutalogo, p.c_rutaimg from pro_proyecto p '+
        'inner join pro_usuarioproyecto up on p.n_idpro_proyecto = up.n_idpro_proyecto '+
        'where p.n_borrado = 0 '+
        'and up.n_borrado = 0 '+
        'and up.n_idseg_userprofile = $1', [n_idseg_userprofile],
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
    get_seleccionproyecto
}
