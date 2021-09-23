const { editComments } = require('../models/comments.js')

exports.patchComments = async (req, res, next) => {
    const id = req.params.comment_id
    const votes = req.body.inc_votes
    if (parseInt(votes)) {
        try {
        const comment = await editComments(votes, id)
        if (comment.length > 0) { 
            const returnComment = comment[0] 
            return res.status(201).send({ article: returnComment })
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