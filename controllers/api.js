const JSON = require('../endpoints.json')

exports.getAPI = async(req, res, next) => {
    res.status(200).send({ endpoints: JSON})
}