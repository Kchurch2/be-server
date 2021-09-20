const express = require('express')
const { handlePSQL400Errors, handleCustomErrors } = require('./errors/error.js')

const apiRouter = require('./routers/api.js');


const app = express();
app.use(express.json());

app.use('/api', apiRouter)

app.all('*' , (req, res) => {
   res.status(404).send({ msg: 'Invalid URL' })     
})

app.use(handlePSQL400Errors)

app.use(handleCustomErrors);

module.exports = app;
