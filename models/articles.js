const db = require('../db/connection');
const format = require('pg-format')

exports.selectArticleByID = async (id) => {
    const res = await db.query('SELECT * FROM articles\
                    WHERE article_id = $1', [id])
    return res.rows[0]
}

exports.editArticleByID = async (votes, id) => {
    const res = await db.query('UPDATE articles\
                    SET votes = votes + $1\
                    WHERE article_id = $2\
                    RETURNING *;', [votes, id])
    return res.rows           
}

exports.selectArticles = async (query) => {
    let sort_by  = 'created_at'
    let sort_order = 'DESC'
    let limit = 10
    let page = 0
    let offset =0
    let queryStr1 = 'SELECT articles.*, count(comments.article_id) as comment_Count FROM articles JOIN comments ON articles.article_id = comments.article_id'
    let queryStr2 = ' GROUP BY articles.article_id'
    let queryStr4 = ' LIMIT $1 OFFSET $2'
    if(query.limit) {
        if (parseInt(query.limit)) {
            limit = query.limit
            console.log(limit)
        } else {
            return Promise.reject({status : 400, msg : 'Bad Request'})
        }
    }
    if (query.page) {
        if (parseInt(query.page)) {
            page = query.page
            offset = ((page-1) * limit)
        } else {
            return Promise.reject({status : 400, msg : 'Bad Request'})
        }
    }
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
    const queryVal = [limit, offset]
    if(query.topic) {
        let topic = query.topic.toLowerCase()
        queryStr1 += ' WHERE articles.topic = $3'
        queryVal.push(topic)
    }
    let queryStr3 = ` ORDER BY ${sort_by} ${sort_order}`
    queryStr1 += queryStr2 + queryStr3 + queryStr4 + ';'  
    console.log(queryStr1)  
    const res = await db.query(queryStr1, queryVal)
    console.log(res.rows)
    return res.rows
}

exports.fetchCommentsByArticle = async (id) => {
    const res = await db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1', [id])
    return res.rows    
}

exports.postCommentsByArticle = async (id, data) => {
    if (!data.hasOwnProperty('body') && !data.hasOwnProperty('username')) {
        return Promise.reject({status :400, msg : 'Bad Request'})
    }
    const {username, body} = data
    const res = await db.query('INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3) RETURNING *;', [username, id, body])
    return res.rows[0] 
}

exports.removeArticleByID = async (id) => {
    console.log(id)
    const res = await db.query('DELETE FROM articles WHERE article_id = $1 RETURNING *;', [id] )
    return res.rows
}
