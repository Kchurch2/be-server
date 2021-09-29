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
    test('200 - responds with JSON object', () => {
        return request(app)
        .get('/api/articles/11')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ article: expect.any(Object)})
            expect(response.body.article).toMatchObject({
                   article_id : expect.any(Number),
                   title : expect.any(String),
                   body : expect.any(String),
                   votes : expect.any(Number),
                   topic : expect.any(String),
                   author : expect.any(String),
                   comment_count : expect.any(String),
                   created_at : new Date(response.body.article.created_at).toJSON()
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
        .patch('/api/articles/1').send({ "inc_votes": 5, "body": 'new Body' })
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
                   created_at : new Date(response.body.article.created_at).toJSON()
            })   
            expect(response.body.article.votes).toBe(105)
            expect(response.body.article.body).toBe('new Body')
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
    test('400 - No Content for bad post', () => {
        return request(app)
        .patch('/api/articles/1').send({})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')

        });
    });
})  

describe('GET /api/articles', () => {
    test('200: responds with JSON object of aricles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles : expect.any(Array)})
            expect(response.body.articles).toHaveLength(10)
            response.body.articles.forEach((article) => {
            expect(article).toMatchObject({            
                article_id : expect.any(Number),
                title : expect.any(String),
                body : expect.any(String),
                votes : expect.any(Number),
                topic : expect.any(String),
                author : expect.any(String),
                comment_count : expect.any(String),
                created_at : new Date(article.created_at).toJSON()
                }) 
            })
            expect(response.body.articles[0].comment_count).toBe('0') 
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
            expect(response.body.articles).toHaveLength(10)
            response.body.articles.forEach((article) => {
            expect(article).toMatchObject({            
                article_id : expect.any(Number),
                title : expect.any(String),
                body : expect.any(String),
                votes : expect.any(Number),
                topic : expect.any(String),
                author : expect.any(String),
                created_at : expect.any(String),
                created_at : new Date(article.created_at).toJSON()
                }) 
            })
            expect(response.body.articles).toBeSortedBy('author', {descending: false})   
        })
    })    
    test('400 - Does not allow injection', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=DROP TABLE topics')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
    test('400 - for invalid sort', () => {
        return request(app)
        .get('/api/articles?sort_by=banana')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
    test('200 - responds with JSON filtered by topic', () =>{
        return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=cats')
        .expect(200)
        .then((response) => {
            expect(response.body.articles[0].topic).toBe('cats')
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
    test('200 - returns JSON object with limit', () =>{
        return request(app)
        .get('/api/articles?limit=1')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles : expect.any(Array)})
            expect(response.body.articles).toHaveLength(1)
            response.body.articles.forEach((article) => {
            expect(article).toMatchObject({            
                article_id : expect.any(Number),
                title : expect.any(String),
                body : expect.any(String),
                votes : expect.any(Number),
                topic : expect.any(String),
                author : expect.any(String),
                created_at : expect.any(String),
                created_at : new Date(article.created_at).toJSON()
                }) 
            })
            expect(response.body.articles[0].article_id).toBe(3)    
        })
    })
    test('200 - returns JSON object with limit & pagination', () => {
        return request(app)
        .get('/api/articles?limit=1&page=2')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ articles : expect.any(Array)})
            expect(response.body.articles).toHaveLength(1)
            expect(response.body.articles[0].article_id).toBe(6)    
        })
    })
    test('200 - returns empty object for out of range', () => {
        return request(app)
        .get('/api/articles?limit=1&page=400')
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toHaveLength(0)
        })
    })
    test('400 bad Request - does not allow injection', () => {
        return request(app)
        .get('/api/articles?limit=1&page=DROP TABLE articles')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
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
                   created_at : new Date(comment.created_at).toJSON()
                    })
                })
            expect(response.body.comments.length).toBe(10)
        }) 
    })
    test('200 - respond with JSON object of comments by article using pagination', () => {
        return request(app)
        .get('/api/articles/1/comments?page=2')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ comments : expect.any(Object)})
            expect(response.body.comments.length).toBe(3)
        }) 
    })
    test('200 - respond with JSON object of comments by article using non-default limit', () => {
        return request(app)
        .get('/api/articles/1/comments?page=2&limit=5')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ comments : expect.any(Object)})
            expect(response.body.comments.length).toBe(5)
        }) 
    })
    test('200 - empty page for out of range', () => {
        return request(app)
        .get('/api/articles/1/comments?page=100&limit=5')
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBe(0)
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
                created_at : new Date(response.body.comment.created_at).toJSON()
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
    test('400 - No content', () => {
        return request(app)
        .post('/api/articles/1/comments').send({})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        }) 
    })  
    test('404 - Not found - username does not exist content', () => {
        return request(app)
        .post('/api/articles/1/comments').send({username:'not-a-user', body: 'test comment' })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        }) 
    }) 
});

describe('GET api/', () => {
    test('returns JSON of all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ endpoints : expect.any(Object)})
        })  
    })    
})

describe('DELETE api/articles/articleID', () => {
    test('204 No Content for Successful Test', () => {
        return request(app)
        .delete('/api/articles/3')
        .expect(204)
        .then((response) => {
            expect(response.body).toMatchObject({})
        })
    })
    test('400 bad request - injection', () => {
        return request(app)
        .delete('/api/articles/ DROP TABLE articles')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
    test('404  - out of range', () => {
        return request(app)
        .delete('/api/articles/305')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        })
    });
    test('404 not found for incorrect string', () => {
        return request(app)
        .delete('/api/articles/id_str')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    });
});


describe('GET api/users', () => {
    test('200 - returns JSON object of usernames', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ users: expect.any(Object)}) 
            response.body.users.forEach((user) =>  {
            expect(user).toMatchObject({
                username : expect.any(String),
            })
        })
    })
})
    test('404 - does not allow injection', () => {  
        return request(app)
        .get('/api/users DROP TABLE users')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid URL')
        })
    })
})

describe('GET api/users/:username', () => {
    test('200 - returns JSON object of usernames', () => {
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject({ user: expect.any(Object)}) 
            expect(response.body.user).toMatchObject({
                username : expect.any(String),
                avatar_url : expect.any(String),
                name : expect.any(String)
            })
        })
    })
    test('404 - does not allow injection', () => {
        return request(app)
        .get('/api/users/DROP TABLE users')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        })
    })
    test('404 - invalid user', () => {
        return request(app)
        .get('/api/users/1')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        })
    })
})

describe('PATCH api/comments/:comment_id', () => {
    test('200 - returns JSON obj of updated comments', () => {
        return request(app)
        .patch('/api/comments/1').send({ "inc_votes": 5, "body": 'new Body' })
        .expect(201)
        .then((response) => {
            expect(response.body.comment).toMatchObject({
                comment_id : expect.any(Number),
                author : expect.any(String),
                article_id : expect.any(Number),
                votes : expect.any(Number),
                body : expect.any(String),
                created_at : new Date(response.body.comment.created_at).toJSON()
            })
            expect(response.body.comment.votes).toBe(21)
            expect(response.body.comment.body).toBe('new Body')   
        }) 
    })
    test('400 does not allow injection', () => {
        return request(app)
        .patch('/api/comments/DROP TABLE comments').send({ "inc_votes": 5 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })    
    })
    test('400 - bad request for non-numeric id', () => {
        return request(app)
        .patch('/api/comments/not-a-num').send({ "inc_votes": 5 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })    
    })
    test('404 - not found for non-existent id', () => {
        return request(app)
        .patch('/api/comments/1507').send({ "inc_votes": 5 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not found')
        })    
    })
    test('400 - bad request for non-numeric id', () => {
        return request(app)
        .patch('/api/comments/1').send({})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })    
    })
});