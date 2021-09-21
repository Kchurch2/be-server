const express = require('express');
const { patchArticleByID, getArticles, getCommentsByArticle, createCommentsByArticle } = require('../controllers/articles.js')

const articlesRouter = express.Router()


articlesRouter.route('/')
    .get(getArticles )

articlesRouter.route('/:article_id')
    .get(getArticles)
    .patch(patchArticleByID)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(createCommentsByArticle)

module.exports = articlesRouter