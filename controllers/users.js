const { selectUsers, selectUserByID  } = require('../models/users.js')
const {checkExists} = require('../db/utils/data-manipulation.js')

exports.getUsers = async( req, res, next) => {
    try{
        const users = await selectUsers()
        res.status(200).send({ users })
    } catch(err) {
        next(err)
      } 
}

exports.getUsersByID = async (req, res, next) => {
    try{
        const username = req.params.username
        const user = await selectUserByID(username)
        if (user.length === 0) {
            await checkExists('users', 'username', username) 
        }
        res.status(200).send({ user: user[0] })
    } catch(err) {
        next(err)
      } 
}