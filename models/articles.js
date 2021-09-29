const db = require('../db/connection');
const format = require('pg-format')

exports.selectArticleByID = async (id) => {
    const res = await db.query('SELECT articles.*, (SELECT COUNT(comments.article_id) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles WHERE articles.article_id = $1;', [id])
    return res.rows[0]
}

exports.editArticleByID = async (votes, id, body) => {
    let queryStr = ''
    let queryVal = []
    if (body) {
        queryStr = 'UPDATE articles\
        SET votes = votes + $1, body = $2\
        WHERE article_id = $3\
        RETURNING *;' 
        queryVal = [votes, body, id]
    } else {
        queryStr = 'UPDATE articles\
        SET votes = votes + $1\
        WHERE article_id = $2\
        RETURNING *;' 
        queryVal = [votes, id]  
    }
    const res = await db.query(queryStr, queryVal)
    return res.rows           
}

exports.selectArticles = async (query) => {
    let sort_by  = 'created_at'
    let sort_order = 'DESC'
    let limit = 10
    let page = 0
    let offset =0
    let queryStr1 = 'SELECT articles.*, count(comments.article_id) as comment_Count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id'
    let queryStr2 = ' GROUP BY articles.article_id'
    let queryStr4 = ' LIMIT $1 OFFSET $2'
    if(query.limit) {
        if (parseInt(query.limit)) {
            limit = query.limit
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
    const res = await db.query(queryStr1, queryVal)
    return res.rows
}

exports.fetchCommentsByArticle = async (id, query) => {
    let limit = 10
    let page = 0
    let offset = 0
    if(query.limit) {
        if (parseInt(query.limit)) {
            limit = query.limit
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
    const res = await db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 LIMIT $2 OFFSET $3', [id, limit, offset])
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
    const res = await db.query('DELETE FROM articles WHERE article_id = $1 RETURNING *;', [id] )
    return res.rows
}
