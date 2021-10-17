const Pool = require('pg').Pool
require('dotenv').config();
console.log(process.env.PG_PASSWORD);
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}