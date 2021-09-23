const express = require('express');
const { patchComments } = require('../controllers/comments.js')

const commmentsRouter = express.Router()

commmentsRouter.route('/:comment_id')
    .patch(patchComments)

module.exports = commmentsRouter