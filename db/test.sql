\c nc_news

SELECT * FROM articles;
SELECT * FROM comments;
SELECT * FROM topics;
SELECT * FROM users;

SELECT articles.*, count(comments.article_id) as comment_Count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ;