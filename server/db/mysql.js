const mysql = require('mysql')

const db = mysql.createPool({
  host: '192.168.188.8',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'xhis',
})

module.exports = db
