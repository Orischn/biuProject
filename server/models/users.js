const { MongoClient } = require('mongodb');


async function getUser(username) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');

    const user = await users.findOne({ username: username });
    if (!user) {
      return 401;
    }
    return { username: user.username, displayName: user.displayName,
         profilePic: user.profilePic, permissions: user.permissions};
  } catch (error) {
    return 500;
  } finally {
    await client.close();
  }
}

async function postUser(user) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const existingUser = await users.findOne({ username: user.username });
    if (existingUser) {
      return 409;
    }
    await users.insertOne({
      username: user.username,
      password: user.password,
      displayName: user.displayName,
      profilePic: user.profilePic,
      permissions: user.permissions,
      isbot: user.isbot,
      lastChat: null
    });
    return 200;
  } catch (error) {
    return 500;
  } finally {
    await client.close();
  }
}

async function deleteUser(user) {
    try {
        await client.connnect();
        const db = client.db('ChatBot');
        const users = db.collection('users');
        await users.deleteOne({username: user.username});
        //const existingUser = await users.findOne({ username: user.username });
        // if (!existingUser) { //user does not exist
        //   return 409;
        // }
    }
    catch(error) {
        return 500;
    } finally {
        await client.close();
    }
}

module.exports = {
  getUser,
  postUser,
  deleteUser
}