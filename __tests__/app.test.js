const request = require('supertest')
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');
const app = require('../app.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('GET api/topics', () => {
    test('200: responds with JSON object of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ topics : expect.any(Array)})
            expect(response.body.topics).toHaveLength(3)
            response.body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                   slug: expect.any(String),
                   description: expect.any(String),
                })    
            })
        })
    });
    test('404 - Invalid URL - does not allow injection', () => {
        return request(app)
        .get('/api/topics DROP TABLE topics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        })
    });  
});

describe('GET /api/articles/:articleID', () => {
    test('200 - respondse with JSON object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles: expect.any(Object)})
            expect(response.body.articles).toMatchObject({
                   article_id : expect.any(Number),
                   title : expect.any(String),
                   body : expect.any(String),
                   votes : expect.any(Number),
                   topic : expect.any(String),
                   author : expect.any(String),
                   created_at : expect.any(String)
            })   
        })      
    });
    test('400 - Bad Request - does not allow injections', () => {
        return request(app)
        .get('/api/articles/1 DROP TABLE articles')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
    test('400 - Incorrect ID for out of range', () => {
        return request(app)
        .get('/api/articles/157')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')

        });
    });
    test('400 - Bad Request -> for non-numerical id', () => {
        return request(app)
        .get('/api/articles/not-a-num')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')

        });
    });
});

describe('PATCH /api/articles/:articleID', () => {
    test('200 - responds with JSON object of altered votes', () => {
        return request(app)
        .patch('/api/articles/1').send({ "inc_votes": 5 })
        .expect(201)
        .then((response) => {
            expect(response.body).toMatchObject({ article: expect.any(Object)})
            expect(response.body.article).toMatchObject({
                   article_id : expect.any(Number),
                   title : expect.any(String),
                   body : expect.any(String),
                   votes : expect.any(Number),
                   topic : expect.any(String),
                   author : expect.any(String),
                   created_at : expect.any(String)
            })   
            expect(response.body.article.votes).toBe(105)
        })      
    });
    test('400 - Bad Request - does not allow injections', () => {
        return request(app)
        .patch('/api/articles/1').send({ "inc_votes": 'DROP TABLE articles' })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
    test('404 - Incorrect ID for out of range', () => {
        return request(app)
        .patch('/api/articles/157').send({ "inc_votes": 5 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')

        });
    });
    test('400 - Bad Request -> for non-numerical id', () => {
        return request(app)
        .patch('/api/articles/not-a-num').send({ "inc_votes": 5 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')

        });
    });  
});

describe('GET /api/articles', () => {
    test('200: responds with JSON object of aricles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles : expect.any(Array)})
            expect(response.body.articles).toHaveLength(4)
            response.body.articles.forEach((article) => {
            expect(article).toMatchObject({            
                article_id : expect.any(Number),
                title : expect.any(String),
                body : expect.any(String),
                votes : expect.any(Number),
                topic : expect.any(String),
                author : expect.any(String),
                created_at : expect.any(String),
                comment_count : expect.any(String)
                }) 
            })
            expect(response.body.articles[0].comment_count).toBe('1') 
            expect(response.body.articles).toBeSortedBy('created_at', {descending: true})    
        })
    }) 
    test('404 - Invalid URL - does not allow injection', () => {
        return request(app)
        .get('/api/articles DROP TABLE topics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        })
    }); 
    test('200 - returns JSON of articles with custom sort field & order', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles : expect.any(Array)})
            expect(response.body.articles).toHaveLength(4)
            response.body.articles.forEach((article) => {
            expect(article).toMatchObject({            
                article_id : expect.any(Number),
                title : expect.any(String),
                body : expect.any(String),
                votes : expect.any(Number),
                topic : expect.any(String),
                author : expect.any(String),
                created_at : expect.any(String),
                comment_count : expect.any(String)
                }) 
            })
            expect(response.body.articles).toBeSortedBy('author', {descending: false})   
        })
    })    
    test('404 - Does not allow injection', () => {
        return request(app)
        .get('/api/?sort_by=author&order=DROP TABLE topics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        })
    })
    test('200 - responds with JSON filtered by topic', () =>{
        return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=cats')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.topic).toBe('cats')
        })    
    })
    test('404 - Does not allow injection', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=DROP TABLE topics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        })
    })
    test('200 - responds with JSON empty array for empty topic', () =>{
        return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=paper')
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toEqual([])
        })    
    }) 
})

describe('GET api/articles/:article_id/comments', () => {
    test('200 - respond with JSON object of comments by article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ comments : expect.any(Object)})
            response.body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
                   comment_id : expect.any(Number),
                   body : expect.any(String),
                   votes : expect.any(Number),
                   author : expect.any(String),
                   created_at : expect.any(String)
                    })
                })
            expect(response.body.comments.length).toBe(13)
        }) 
    })
    test('404 - Invalid URL for typo', () => {
        return request(app)
        .get('/api/articles/1/commnets')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        }) 
    });
    test('404 - Does not allow injection', () => {
        return request(app)
        .get('/api/articles/1/DROP TABLE comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        }) 
    });
    test('400 - Invalid article_id type', () => {
        return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        }) 
    });
    test('404 - Not found for out-of-range id', () => {
        return request(app)
        .get('/api/articles/1500/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        }) 
    });
    test('200 - empty array for id with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBe(0)
            expect(response.body.comments).toEqual([])
        }) 
    });
});

describe('POST api/articles/:article_id/comments', () => {
    test('201 return JSON of posted object', () => {
        return request(app)
        .post('/api/articles/2/comments').send({username:'butter_bridge', body: 'test comment' })
        .expect(201)
        .then((response) => {
            expect(response.body).toMatchObject({ comment: expect.any(Object)})
            expect(response.body.comment).toMatchObject({
                comment_id : expect.any(Number),
                body : expect.any(String),
                votes : expect.any(Number),
                author : expect.any(String),
                created_at : expect.any(String)
            }) 
        })
    });  
    test('400 - Invalid article_id type', () => {
        return request(app)
        .post('/api/articles/not-an-id/comments').send({username:'butter_bridge', body: 'test comment' })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        }) 
    });
    test('404 - Not found for out-of-range id', () => {
        return request(app)
        .post('/api/articles/150/comments').send({username:'butter_bridge', body: 'test comment' })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        }) 
    });
});