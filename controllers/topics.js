const { selectTopics } = require('../models/topics.js')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        console.log(err)
        next(err)
      })
}