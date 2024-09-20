const { MongoClient } = require('mongodb');


async function getUser(username) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');

    const user = await users.findOne({ username: username });
    if (!user) {
      return 404;
    }
    return user;
  } catch (error) {
    return 500;
  } finally {
    await client.close();
  }
}

async function getUsers() {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');

    const allUsers = await users.findMany({});
    if (!allUsers) {
      return 404;
    }
    return allUsers;
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
    return 201;
  } catch (error) {
    console.log(error);
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
    const existingUser = await users.findOne({ username: user.username });
    if (!existingUser) {
      return 404;
    }
    const chats = db.collection('chats');
    await chats.deleteMany({userId: user.username});
    await users.deleteOne({username: user.username});
    return 200;
  }
  catch(error) {
    console.log(error);
    return 500;
  } finally {
    await client.close();
  }
}

async function changeAdminPermissions(user, permissions) {
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const existingUser = await users.findOne({ username: user.username });
    if (!existingUser) {
      return 404;
    }
    await users.updateOne({existingUser},
      {
        $update: {
          permissions : permissions
        }
      }
    )
  }
}

module.exports = {
  getUser,
  getUsers,
  postUser,
  deleteUser,
  changeAdminPermissions,
}