const db = require('../db/connection');
const format = require('pg-format')

exports.selectArticleByID = (id) => {
    return db.query('SELECT * FROM articles\
                    WHERE article_id = $1', [id])
    .then((res) => {
        return res.rows
    })
}

exports.editArticleByID = (votes, id) => {
    return db.query('UPDATE articles\
                    SET votes = votes + $1\
                    WHERE article_id = $2\
                    RETURNING *;', [votes, id])
    .then((res) => {
        return res.rows
    })                
}

exports.selectArticles = () => {
    return db.query('SELECT articles.*,\
                    count(comments.article_id) as comment_Count\
                    FROM articles\
                    JOIN comments ON\
                    articles.article_id = comments.article_id\
                    GROUP BY articles.article_id;')
 .then((res) => {
     console.log(res.rows)
      return res.rows
 })
}
