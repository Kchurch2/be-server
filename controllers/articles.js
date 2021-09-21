const { editArticleByID, selectArticles, fetchCommentsByArticle, postCommentsByArticle } = require('../models/articles.js')
const {checkExists} = require('../db/utils/data-manipulation.js')


exports.getArticles = async(req, res, next) => {
  try {  
    if(req.params.article_id && !parseInt(req.params.article_id)){
      await Promise.reject({ status: 400, msg: 'Bad Request'})
    } else {    
      const id = req.params.article_id
      const query = req.query
      const articles = await selectArticles(id, query)
      if (articles.length > 1) { 
        res.status(200).send({ articles })
      } else if (articles.length > 0) {
        const returnArticle = articles[0] 
        res.status(200).send({ articles: returnArticle })
      } else {
        await checkExists('topics', 'slug', req.query.topic)
      }
      res.status(200).send({ articles })
    }
   } catch(err) {
        next(err)
    }
  }

exports.patchArticleByID = async(req, res, next) => {
    const id = req.params.article_id
    const votes = req.body.inc_votes
    if (parseInt(votes)) {
    try {
      const article = await editArticleByID(votes, id)
        if (article.length > 0) { 
          const returnArticle = article[0] 
          res.status(201).send({ article: returnArticle })
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
  const comments = await fetchCommentsByArticle(id)
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