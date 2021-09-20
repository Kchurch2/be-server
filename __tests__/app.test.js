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
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Incorrect ID')

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
            expect(response.body.msg).toBe('Incorrect ID')
        })
    })
    test('400 - Incorrect ID for out of range', () => {
        return request(app)
        .patch('/api/articles/157').send({ "inc_votes": 5 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Incorrect ID')

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

describe('Name of the group', () => {
    test('200: responds with JSON object of topics', () => {
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
})