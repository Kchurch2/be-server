const { formatData, checkExists } = require('../db/utils/data-manipulation.js')
const { articleData, commentData, topicData, userData } = require('../db/data/test-data')
const db = require('../db/connection.js')

describe('formatTopics', () => {
    test('should return empty array', () => {
        expect(formatData([])).toEqual([])
    })
    test('should return correctly formatted topic data', () => {
        const input = topicData
        const arr = ['slug', 'description']
        const expected  = [['mitch', 'The man, the Mitch, the legend'],
                            ['cats', 'Not dogs'],
                            ['paper', 'what books are made of']]
        expect(formatData(input, arr)).toEqual(expected)       
    });
    test('should return correctly formatted comment data', () => {
        const input = commentData
        const arr = ['author', 'article_id', 'votes', 'created_at', 'body' ]
        const expected  = ['butter_bridge', 9, 16, new Date(1586179020000), "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"]
        expect(formatData(input, arr)[0]).toEqual(expected)       
    });
    test('should return correctly formatted user data', () => {
        const input = userData
        const arr = ['username', 'avatar_url', 'name']
        const expected  = [['butter_bridge', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'jonny'],
        ['icellusedkars','https://avatars2.githubusercontent.com/u/24604688?s=460&v=4','sam'],
        ['rogersop','https://avatars2.githubusercontent.com/u/24394918?s=400&v=4','paul'],
        ['lurker','https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 'do_nothing']]
        expect(formatData(input, arr)).toEqual(expected)       
    });
    test('should return correctly formatted article data', () => {
        const input = articleData
        const arr = ['title', 'body', 'votes', 'topic', 'author', 'created_at']
        const expected  = ['Living in the shadow of a great man', 'I find this existence challenging',100, 'mitch', 'butter_bridge', new Date(1594329060000)]
        expect(formatData(input, arr)[0]).toEqual(expected)       
    });
    test('Does not mutate input data', () => {
        const inputdata =  [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: new Date(1594329060000),
            votes: 100
          },
          {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: new Date(1602828180000),
            votes: 0
          }]
        const arr = ['title', 'body', 'votes', 'topic', 'author', 'created_at']
        formatData(inputdata, arr)
        expect(inputdata).toEqual([{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: new Date(1594329060000),
            votes: 100
          },
          {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: new Date(1602828180000),
            votes: 0
          }])  
          expect(formatData(inputdata, arr)).not.toBe(inputdata)
    });
});
