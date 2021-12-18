const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SolRedes2022_2',
  password: '1234',
  port: 5432
})

module.exports={
    pool
}