const { selectArticleByID, editArticleByID, selectArticles } = require('../models/articles.js')

exports.getArticleByID = (req, res, next) => {
    const id = req.params.article_id
    selectArticleByID(id)
    .then((articles) => {
       if (articles.length > 0) { 
       const returnArticle = articles[0] 
        res.status(200).send({ article: returnArticle })
       } else {
        return Promise.reject({ status: 400, msg: 'Incorrect ID'})
       }
    })
    .catch((err) => {
        next(err)
      })
}

exports.patchArticleByID = (req, res, next) => {
  const id = req.params.article_id
  const votes = req.body.inc_votes
  //console.log(parseInt(votes))
  if (parseInt(votes)) {
  editArticleByID(votes, id)
  .then((article) => {
    if (article.length > 0) { 
      const returnArticle = article[0] 
       res.status(201).send({ article: returnArticle })
      } else {
       return Promise.reject({ status: 400, msg: 'Incorrect ID'})
      }
   })
   .catch((err) => {
    next(err)
  })
  } else {
    return Promise.reject({ status: 400, msg: 'Incorrect ID'})
    .catch((err) => {
      next(err)
    })
  }
  
}

exports.getArticles = (req, res, next) => {
  selectArticles()
  .then((articles) => {
    res.status(200).send({ articles })
})
.catch((err) => {
    console.log(err)
    next(err)
  })
}