const express = require('express')
const { handlePSQL400Errors, handleCustomErrors, handle23503 } = require('./errors/error.js')
const cors = require('cors');
const apiRouter = require('./routers/api.js');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter)

app.all('*' , (req, res) => {
   res.status(404).send({ msg: 'Invalid URL' })     
})

app.use(handlePSQL400Errors)

app.use(handleCustomErrors);

app.use(handle23503);

module.exports = app;
