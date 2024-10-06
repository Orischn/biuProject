const { MongoClient } = require('mongodb');

async function getPractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({ chatId: chatId, userId: userId});
        return practice;
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

async function getPractices(userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const res = await practices.find({userId: userId}).toArray();
        return res.reverse();
    } catch (error) {
        console.log(error);
        return 500;
    } finally {
        await client.close();
    }
}


async function postPractice(userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let nextChat = await practices.find({userId: userId}).toArray();
        var chatId = nextChat.length + 1;

        const practice = {
            userId: userId,
            chatId: chatId,
            messages: [],
            grade: 0,
            startDate: dateTime,
            endDate: null,
            alive: true
        }
        await practices.insertOne(practice);
        return practice;
    } catch (error) {
        console.log(error);
        return 500;
    } finally {
        await client.close();
    }
}

async function deletePractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('pratices');
        const practice = await practices.findOne({ chatId: chatId, userId: userId});
        if (!practice) {
            return 404;
        }
        await practices.deleteOne({ chatId: chatId, userId: userId});
        return 200;
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

async function endPractice(userId, chatId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        await practices.updateOne(
            { chatId: chatId, userId: userId, alive: false },
            {
                $set: {
                    alive: true,
                    endDate: dateTime,
                },
            },
        )
        return 200;
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

async function getMessages(chatId, userId) {
    try {
        const chat = await getPractice(chatId, userId);
        return chat.messages;
    } catch (error) {
        console.log(error)
        return 500;
    }
}

async function addMessage(userId, chatId, content, isBot) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        await practices.updateOne(
            { chatId: chatId, userId: userId, alive: true },
            {
                $push: {
                    messages: {
                        $each: [{ content: content, isBot: isBot }],
                        $position: 0
                    }
                }
            }
        )
        return 200
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

async function updateGrade(userId, chatId, newGrade) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        await practices.updateOne(
            { chatId: chatId, userId: userId, alive: false },
            {
                $set: {
                    grade: newGrade,
                },
            },
        )
        return 200;
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

module.exports = {
    getPractice,
    getPractices,
    deletePractice,
    postPractice,
    endPractice,
    addMessage,
    getMessages,
    updateGrade,
}