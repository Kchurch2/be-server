const db = require('../db/connection');

exports.editComments = async (votes, id, body) => {
    let queryStr = ''
    let queryVal = []
    if (body) {
        queryStr = 'UPDATE comments\
        SET votes = votes + $1, body = $2\
        WHERE comment_id = $3\
        RETURNING *;' 
        queryVal = [votes, body, id]
    } else {
        queryStr = 'UPDATE comments\
        SET votes = votes + $1\
        WHERE comment_id = $2\
        RETURNING *;' 
        queryVal = [votes, id]  
    }
    const res = await db.query(queryStr, queryVal)
    return res.rows           
}
