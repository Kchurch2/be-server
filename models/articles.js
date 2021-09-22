const db = require('../db/connection');
const format = require('pg-format')

// exports.selectArticleByID = async (id) => {
//     const res = await db.query('SELECT * FROM articles\
//                     WHERE article_id = $1', [id])
//     console.log(res.rows)
//     return res.rows
// }

exports.editArticleByID = async (votes, id) => {
    const res = await db.query('UPDATE articles\
                    SET votes = votes + $1\
                    WHERE article_id = $2\
                    RETURNING *;', [votes, id])
    return res.rows           
}

exports.selectArticles = async (id, query) => {
    let sort_by  = 'created_at'
    let sort_order = 'DESC'
    let topic_str = ''
    let queryStr1 = 'SELECT articles.*, count(comments.article_id) as comment_Count FROM articles JOIN comments ON articles.article_id = comments.article_id'
    let queryStr2 = ' GROUP BY articles.article_id'
    if(query.sort_by) {
        if(query.sort_by == 'title' || query.sort_by == 'author' || query.sort_by== 'topic' || query.sort_by == 'created_at' || query.sort_by == 'comments_count') {
        sort_by = query.sort_by
        } else { 
            return Promise.reject({status : 400, msg : 'Bad Request'})
        }
    }    
    if (query.order) {
        if(query.order.toUpperCase() === 'ASC' || query.order.toUpperCase() === 'DESC') {
        sort_order = query.order
        } else { 
            return Promise.reject({status : 400, msg : 'Bad Request'})
        }
    }
    const queryVal = []
    if(parseInt(id)) {
        queryStr1 += ' WHERE articles.article_id = $1'
        queryVal.push(id)
    }
    if(query.topic) {
        let topic = query.topic.toLowerCase()
        queryStr1 += ' WHERE articles.topic = $1'
        queryVal.push(topic)
    }
    let queryStr3 = ` ORDER BY ${sort_by} ${sort_order}`
        queryStr1 += queryStr2 + queryStr3 + ';'    
    const res = await db.query(queryStr1, queryVal)
    return res.rows
}

exports.fetchCommentsByArticle = async (id) => {
    const res = await db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1', [id])
    return res.rows    
}

exports.postCommentsByArticle = async (id, data) => {
    if (!data.hasOwnProperty('body') && !data.hasOwnProperty('username')) {
        return Promise.reject({status :204, msg : 'No Content'})
    }
    const {username, body} = data
    const res = await db.query('INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3) RETURNING *;', [username, id, body])
    return res.rows[0] 
}

