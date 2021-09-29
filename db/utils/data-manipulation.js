// extract any functions you are using to manipulate your data, into this file
const format = require('pg-format')
const db = require('../connection')

exports.formatData = (data, fields) => {
    const mapped = data.map((item) => {
        const returnArr = []
        for (let i = 0; i<fields.length; i++) {
            returnArr.push(item[fields[i]])
        }
    return returnArr
    })
return mapped
}

exports.checkExists = async (table, column, ref) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    const dbOutput = await db.query(queryStr, [ref]);
    if (dbOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
    }
}