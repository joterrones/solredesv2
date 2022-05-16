const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bdsol6',
  password: '1234',
  port: 5432
})

module.exports={
    pool
}