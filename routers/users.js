const express = require('express');

const { getUsers, getUsersByID } = require('../controllers/users.js')

const usersRouter = express.Router()

usersRouter.route('/')
    .get(getUsers)

usersRouter.route('/:username')
    .get(getUsersByID)

module.exports = usersRouter