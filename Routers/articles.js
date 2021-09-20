const express = require('express');
const { getArticleByID, patchArticleByID, getArticles } = require('../controllers/articles.js')

const articlesRouter = express.Router()


articlesRouter.route('/')
    .get(getArticles)

articlesRouter.route('/:article_id')
    .get(getArticleByID )
    .patch(patchArticleByID)

module.exports = articlesRouter