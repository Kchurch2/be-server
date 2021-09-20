const topicsRouter = require('./topics.js')
const articlesRouter = require('./articles.js')
const express = require('express')

const apiRouter = express.Router()

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

module.exports = apiRouter