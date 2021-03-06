const express = require('express');
const { patchArticleByID, getArticles, getCommentsByArticle, createCommentsByArticle, getArticleByID, deleteArticleByID, postArticleByID} = require('../controllers/articles.js')

const articlesRouter = express.Router()


articlesRouter.route('/')
    .get(getArticles )

articlesRouter.route('/:article_id')
    .get(getArticleByID)
    .patch(patchArticleByID)
    .delete(deleteArticleByID)
 //   .post(postArticleByID)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(createCommentsByArticle)

module.exports = articlesRouter