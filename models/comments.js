const db = require('../db/connection');

exports.editComments = async (votes, id) => {
    const res = await db.query('UPDATE comments\
                    SET votes = votes + $1\
                    WHERE comment_id = $2\
                    RETURNING *;', [votes, id])
    return res.rows
}
