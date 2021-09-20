// extract any functions you are using to manipulate your data, into this file
exports.formatTopics = (topicData) => {
    const mapped = topicData.map((topic) => {
        return [topic.slug, topic.description]
    })
return mapped
}

exports.formatUsers = (userData) => {
    const mapped = userData.map((user) => {
        return [user.username, user.avatar_url, user.name]
    })
  return mapped  
}

exports.formatArticles = (articleData) => {
    const mapped  = articleData.map((article) => {
        return [article.title, article.body, article.votes, article.topic, article.author, article.created_at]
    })
  return mapped  
}

exports.formatComments = (commentData) => {
    const mapped = commentData.map((comment) => {
        return [comment.author, comment.article_id, comment.votes, comment.created_at, comment.body]
    })
    return mapped
}
