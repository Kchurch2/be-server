const { editArticleByID, selectArticles, fetchCommentsByArticle, postCommentsByArticle, selectArticleByID, removeArticleByID } = require('../models/articles.js')
const {checkExists} = require('../db/utils/data-manipulation.js')

exports.getArticleByID = async(req, res, next) => {
  try {
    const id = req.params.article_id
    const article = await selectArticleByID(id)
    if(!article) {
      await checkExists('articles', 'article_id', id)
    }
    return res.status(200).send({ article })
  } catch(err) {
    next(err)
  } 
} 

exports.getArticles = async(req, res, next) => {
  try {  
    if(req.params.article_id && !parseInt(req.params.article_id)){
      await Promise.reject({ status: 400, msg: 'Bad Request'})
    } else {    
      const query = req.query
      const articles = await selectArticles(query)
      if (articles.length >= 1) { 
        return res.status(200).send({ articles })
      } else if (req.query.topic) {
        await checkExists('topics', 'slug', req.query.topic)
      } else {
        res.status(200).send({ articles })
      }
    res.status(200).send({ articles })
    }
   } catch(err) {
        next(err)
    }
  }

exports.patchArticleByID = async(req, res, next) => {
    let votes = 0
    if (parseInt(req.body.inc_votes)) {
      votes = req.body.inc_votes
    }
    const id = req.params.article_id
    const body = req.body.body
    if (parseInt(req.body.inc_votes) || req.body.body) {
    try {
      const article = await editArticleByID(votes, id, body)
        if (article.length > 0) { 
          const returnArticle = article[0] 
          return res.status(201).send({ article: returnArticle })
        } else {
          await Promise.reject({ status: 404, msg: 'Not found'})
          }
    } catch(err) {
      next(err)
    } 
    } else {
    try {
      await Promise.reject({ status: 400, msg: 'Bad Request'})
    } catch(err) {
      next(err)
    }
  }  
}

exports.getCommentsByArticle = async (req, res, next) => {
  try {
  const id = req.params.article_id
  const query = req.query
  const comments = await fetchCommentsByArticle(id, query)
  if (comments.length === 0) {
    await checkExists('articles', 'article_id', id)
  }
  res.status(200).send({ comments })
  } catch (err) {
    next(err)
  }
}

exports.createCommentsByArticle = async (req, res, next) => {
  try {
  const id = req.params.article_id
  const data = req.body
  const comment = await postCommentsByArticle(id, data)
   res.status(201).send({ comment })
  } catch (err) {
    next(err)
  }
}

exports.deleteArticleByID = async (req, res, next) => {
  try {
    const id = req.params.article_id
    const article = await removeArticleByID(id)
    console.log(article)
    if(article.length === 0) {
      await checkExists('articles', 'article_id', id)
    }
    res.status(204).send(article[0])

  } catch (err) {
    next(err)
  }
}