\c nc_news

SELECT * FROM articles;
SELECT * FROM comments;
SELECT * FROM topics;
SELECT * FROM users;

--SELECT articles.*, count(comments.article_id) as comment_Count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = 1 GROUP BY articles.article_id ;

INSERT INTO comments (author, article_id, body) VALUES ('tickle122', 550, 'body') RETURNING *;