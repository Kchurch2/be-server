
exports.handlePSQL400Errors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' })
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
}

exports.handle23503 = (err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ msg: `Not found 23503 ... ${err}` })
    } else {
        next(err);
    }
};