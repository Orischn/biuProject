const { MongoClient } = require('mongodb');

async function getPractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = await client.db('ChatBot');
        const chats = db.collection('chats');
        const chat = await chats.findOne({ chatId: chatId, userId: userId});
        return chat;
    } catch (error) {
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
        const chats = db.collection('chats');
        const res = await chats.find({userId});
        return res;
    } catch (error) {
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
        const chats = db.collection('practices');

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let nextChat = chats.find({userId: userId});
        nextChat = nextChat ? nextChat.sort({chatId:-1}).limit(1).chatId : 1;
        
        console.log(userId);
        console.log(nextChat);

        const chat = {
            userId: userId,
            chatId: nextChat,
            messages: [],
            startDate: dateTime,
            endDate: null
        }
        await chats.insertOne(chat);
        existingUser.lastChat = chat;


        return chat;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

async function deletePractice(chatID, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('Whatsapp');
        const chats = db.collection('chats');
        const chat = await chats.findOne({ chatID: chatID, userId: userId});
        if (!chat) {
            return 404;
        }
        await chats.deleteOne({ chatID: chatID, userId: userId});
        return 200;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

async function getMessages(chatID, userId) {
    try {
        const chat = await getChat(chatID, me);
        return chat.messages;
    } catch (error) {
        return 500;
    }
}

async function addMessage(userId, content, isBot) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const chats = db.collection('chats');
        const user = await getUser(userId);
        if (!user) {
            return 404;
        }
        await chats.updateOne(
            { chatID: user.lastChat.chatID, userId: userId },
            {
                $push: {
                    messages: {
                        $each: [{ content: content, isBot: isBot }],
                        $position: 0
                    }
                }
            }

        )
        return 200;
    } catch (error) {
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
    addMessage,
    getMessages,
}