const db = require('../connection.js')
const format = require('pg-format')
const { formatData } = require('../utils/data-manipulation.js')

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  await db.query('DROP TABLE IF EXISTS comments;')
  await db.query('DROP TABLE IF EXISTS articles;')
  await db.query('DROP TABLE IF EXISTS users;')
  await db.query('DROP TABLE IF EXISTS topics;')
  .then(() => {
              return db.query('CREATE TABLE topics (slug VARCHAR(20) PRIMARY KEY,\
              description VARCHAR(100) NOT NULL);')
  })              
  .then(() => { 
              return db.query('CREATE TABLE users\
              (username VARCHAR(20) PRIMARY KEY,\
              avatar_url VARCHAR(500) NOT NULL,\
              name VARCHAR(100) NOT NULL);')
  })               
  .then(() => {
              return db.query('CREATE TABLE articles\
              (article_id SERIAL PRIMARY KEY,\
              title VARCHAR(250) NOT NULL,\
              body TEXT NOT NULL,\
              votes INT DEFAULT 0,\
              topic VARCHAR(20) REFERENCES topics(slug) ON DELETE CASCADE,\
              author VARCHAR(20) REFERENCES users(username) ON DELETE CASCADE,\
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);')
  })
.then(() => {
              return db.query('CREATE TABLE comments\
              (comment_id SERIAL PRIMARY KEY,\
              author VARCHAR(20) REFERENCES users(username) ON DELETE CASCADE,\
              article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,\
              votes INT DEFAULT 0,\
              body TEXT NOT NULL,\
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);')
}).then(() => {
  const mappedTopics = formatData(topicData, ['slug', 'description'])
  const insertIntoTopics = format(`
  INSERT INTO
  topics
  (slug, description)
  VALUES
  %L
  RETURNING *;`, 
  mappedTopics)
return db.query(insertIntoTopics)
}).then(() => {
  const mappedUsers = formatData(userData, ['username', 'avatar_url', 'name'])
  const insertIntoUser = format(`
  INSERT INTO 
  users 
  (username, avatar_url, name) 
  VALUES 
  %L 
  RETURNING *;`, 
  mappedUsers)
  return db.query(insertIntoUser)
}) .then (() => {  
  const mappedArticles = formatData(articleData, ['title', 'body', 'votes', 'topic', 'author', 'created_at'])
  const insertIntoArticles = format(`
  INSERT INTO
  articles
  (title, body, votes, topic, author, created_at)
  VALUES
  %L
  RETURNING *;`, 
  mappedArticles)
 return db.query(insertIntoArticles) 
}).then(() => {
 const mappedComments = formatData(commentData, ['author', 'article_id', 'votes', 'created_at', 'body' ])
 const insertIntoComments = format(`
 INSERT INTO
 comments
 (author, article_id, votes, created_at, body)
 VALUES
 %L
 RETURNING *;`, 
 mappedComments)
 return db.query(insertIntoComments) 
})                                     
};

module.exports = seed;
