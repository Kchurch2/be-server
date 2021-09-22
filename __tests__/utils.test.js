const { format, checkExists } = require('../db/utils/data-manipulation.js')
const { articleData, commentData, topicData, userData } = require('../db/data/test-data')
const db = require('../db/connection.js')

describe('formatTopics', () => {
    test('should return empty array', () => {
        expect(format([])).toEqual([])
    })
    test('should return correctly formatted topic data', () => {
        const input = topicData
        const arr = ['slug', 'description']
        const expected  = [['mitch', 'The man, the Mitch, the legend'],
                            ['cats', 'Not dogs'],
                            ['paper', 'what books are made of']]
        expect(format(input, arr)).toEqual(expected)       
    });
    test('should return correctly formatted comment data', () => {
        const input = commentData
        const arr = ['author', 'article_id', 'votes', 'created_at', 'body' ]
        const expected  = ['butter_bridge', 9, 16, new Date(1586179020000), "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"]
        expect(format(input, arr)[0]).toEqual(expected)       
    });
    test('should return correctly formatted user data', () => {
        const input = userData
        const arr = ['username', 'avatar_url', 'name']
        const expected  = [['butter_bridge', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'jonny'],
        ['icellusedkars','https://avatars2.githubusercontent.com/u/24604688?s=460&v=4','sam'],
        ['rogersop','https://avatars2.githubusercontent.com/u/24394918?s=400&v=4','paul'],
        ['lurker','https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 'do_nothing']]
        expect(format(input, arr)).toEqual(expected)       
    });
    test('should return correctly formatted article data', () => {
        const input = articleData
        const arr = ['title', 'body', 'votes', 'topic', 'author', 'created_at']
        const expected  = ['Living in the shadow of a great man', 'I find this existence challenging',100, 'mitch', 'butter_bridge', new Date(1594329060000)]
        expect(format(input, arr)[0]).toEqual(expected)       
    });
});
