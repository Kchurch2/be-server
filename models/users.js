
const db = require('../db/connection');

exports.selectUsers = async () => {
    const res = await db.query('SELECT username FROM users')
    return res.rows
}

exports.selectUserByID = async (username) => {
    const res = await db.query('SELECT username, name, avatar_url FROM users where username = $1', [username])
    return res.rows
}