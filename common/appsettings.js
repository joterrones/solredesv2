const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'solredespostgres.cluster-c2xs6vpymflg.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'Candwi202288',
  port: 5432
  
  /*user: 'postgres',
  host: 'localhost',
  database: 'bdsol7.5',
  password: '123',
  port: 5432*/
})

module.exports={
    pool
}
