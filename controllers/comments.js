const { editComments } = require('../models/comments.js')

exports.patchComments = async (req, res, next) => {
    let votes = 0
    if (parseInt(req.body.inc_votes)) {
      votes = req.body.inc_votes
    }
    const id = req.params.comment_id
    const body = req.body.body
    if (parseInt(req.body.inc_votes) || req.body.body) {
        try {
        const comment = await editComments(votes, id, body)
        if (comment.length > 0) { 
            const returnComment = comment[0] 
            return res.status(201).send({ comment: returnComment })
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