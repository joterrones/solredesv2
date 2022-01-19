const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SOL_REDES',
  password: '123',
  port: 5432
})

module.exports={
    pool
}