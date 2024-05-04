const { MongoClient } = require('mongodb');

async function getChat(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = await client.db('ChatBot');
        const chats = db.collection('chats');
        const chat = await chats.findOne({ chatId: chatId, userId: userId});
        if (!chat) {
            return 404;
        }
        return chat;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

async function getChats(userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const chats = db.collection('chats');
        const res = await chats.find({userId});
        if (!res) {
            return 404;
        }
        return res;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}


async function postChat(user) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = await client.db('ChatBot');
        const chats = db.collection('chats');
        const users = db.collection('users');

        const existingUser = await users.findOne(user.username);
        if (!existingUser) {
            return 404;
        }

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let nextChat = db.collection.find({userId: user.username});
        if(nextChat) {
            nextChat.endDate = dateTime;
        }

        nextChat = nextChat ? nextChat.sort({chatId:-1}).limit(1).chatId : 1;

        const chat = {
            userId: user,
            chatId: nextChat,
            messages: [],
            startDate: dateTime,
            endDate: null
        }
        await chats.insertOne(chat);
        existingUser.lastChat = chat;


        return 201;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

async function deleteChat(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('Whatsapp');
        const chats = db.collection('chats');
        const chat = await chats.findOne({ chatId: chatId, userId: userId});
        if (!chat) {
            return 404;
        }
        await chats.deleteOne({ chatId: chatId, userId: userId});
        return 200;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

async function getMessages(chatId, userId) {
    try {
        const chat = await getChat(chatId, me);
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
            { chatId: user.lastChat.chatId, userId: userId },
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
    getChat,
    getChats,
    postChat,
    deleteChat,
    addMessage,
}