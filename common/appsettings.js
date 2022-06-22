const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '35.184.146.235',
  database: 'SOL_REDES-V2_3',
  password: '123',
  port: 5432


})

module.exports={
    pool
}