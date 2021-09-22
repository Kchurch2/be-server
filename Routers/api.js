const topicsRouter = require('./topics.js')
const articlesRouter = require('./articles.js')
const express = require('express')
const { getAPI } = require('../controllers/api')

const apiRouter = express.Router()

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.route('/')
    .get(getAPI)

module.exports = apiRouter