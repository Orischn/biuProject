const { MongoClient } = require('mongodb');

async function getPractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({ chatId: chatId, userId: userId });
        return { status: 200, practice: practice };
    } catch (error) {
        return { status: 500, practice: error };
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
        return { status: 200, practices: res.reverse() };
    } catch (error) {
        return { status: 500, practices: error };
    } finally {
        await client.close();
    }
}


async function postPractice(userId, chatId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const practices = db.collection('practices');
        if (!tasks.findOne({taskName: chatId}).toArray()) {
            return { status: 404, practice: "Cannot create practice since task doesn't exist." };
        }
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const practice = {
            userId: userId,
            chatId: chatId,
            messages: [],
            grade: 0,
            startDate: dateTime,
            submissionDate: null,
            alive: true
        };
        await practices.insertOne(practice);
        return { status: 200, practice: practice };
    } catch (error) {
        return { status: 500, practice: error };
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
        const practice = await practices.findOne({ chatId: chatId, userId: userId });
        if (!practice) {
            return {status: 404, error: "Can not delete practice since the practice doesn't exist." };
        }
        await practices.deleteOne({ chatId: chatId, userId: userId });
        return { status: 200, error: "" };
    } catch (error) {
        return { status: 500, error: error };
    } finally {
        await client.close();
    }
}

async function submitPractice(userId, chatId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const tasks = db.collection('tasks');
        const task = await tasks.findOne({ taskName: chatId }).toArray();
        if (!task) {
            return { status: 404, error: "Can not submit practice since the practice doesn't exist." };
        }
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        if (dateTime > task.endDate) {
            return { status: 403, error: "Submission date passed." };
        }
        await practices.updateOne(
            { chatId: chatId, userId: userId, alive: true },
            {
                $set: {
                    alive: false,
                    submissionDate: dateTime,
                },
            },
        );
        await tasks.updateOne(
            {taskName: chatId, 'submitList.userId': userId},
            {
                $set: {
                    'submitList.$.didSubmit': true,
                }
            }
        );
        return { status: 200, error: "" };
    } catch (error) {
        return {status: 500, error: error };
    } finally {
        await client.close();
    }
}

async function getMessages(chatId, userId) {
    try {
        const chat = await getPractice(chatId, userId);
        return {status: 200, messages: chat.messages };
    } catch (error) {
        return {status: 500, messages: error };
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
        );
        return { status: 200, error: "" };
    } catch (error) {
        return {status: 500, error: error };
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
        );
        return { status: 200, error: "" };
    } catch (error) {
        return {status: 500, error: error };
    } finally {
        await client.close();
    }
}

module.exports = {
    getPractice,
    getPractices,
    deletePractice,
    postPractice,
    submitPractice,
    addMessage,
    getMessages,
    updateGrade,
};