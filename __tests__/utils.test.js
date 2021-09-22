const { formatTopics, formatArticles, formatUsers, formatComments, checkExists } = require('../db/utils/data-manipulation.js')
const { articleData, commentData, topicData, userData } = require('../db/data/test-data')
const db = require('../db/connection.js')

describe('formatTopics', () => {
    test('should return empty array', () => {
        expect(formatTopics([])).toEqual([])
    })
    test('should return correctly formatted test data', () => {
        const input = topicData
        const expected  = [['mitch', 'The man, the Mitch, the legend'],
                            ['cats', 'Not dogs'],
                            ['paper', 'what books are made of']]
        expect(formatTopics(input)).toEqual(expected)       
    });
});

describe('formatArticles', () => {
    test('should return empty array', () => {
        expect(formatArticles([])).toEqual([])
    })
    test('should return correctly formatted test data', () => {
        const input = articleData
        const expected  = ['Living in the shadow of a great man', 'I find this existence challenging',100, 'mitch', 'butter_bridge', new Date(1594329060000)]
        expect(formatArticles(input)[0]).toEqual(expected)       
    });
});


describe('formatUsers', () => {
    test('should return empty array', () => {
        expect(formatUsers([])).toEqual([])
    })
    test('should return correctly formatted test data', () => {
        const input = userData
        const expected  = [['butter_bridge', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'jonny'],
                            ['icellusedkars','https://avatars2.githubusercontent.com/u/24604688?s=460&v=4','sam'],
                            ['rogersop','https://avatars2.githubusercontent.com/u/24394918?s=400&v=4','paul'],
                            ['lurker','https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 'do_nothing']]
        expect(formatUsers(input)).toEqual(expected)       
    });
});


describe('formatComments', () => {
    test('should return empty array', () => {
        expect(formatComments([])).toEqual([])
    })
    test('should return correctly formatted test data', () => {
        const input = commentData
        const expected  = ['butter_bridge', 9, 16, new Date(1586179020000), "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"]
        expect(formatComments(input)[0]).toEqual(expected)       
    });
});
