const { MongoClient } = require('mongodb');


async function getUser(userId) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const user = await users.findOne({ userId: userId });
    if (!user) {
      return 404;
    }
    return user;
  } catch (error) {
    console.log(error)
    return 500;
  } finally {
    await client.close();
  }
}

async function getStudents() {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');

    const allStudents = await users.find({ permissions: false }).toArray();
    if (!allStudents) {
      return 404;
    }
    return allStudents;
  } catch (error) {
    console.log(error)
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
    const existingUser = await users.findOne({ userId: user.userId });
    if (existingUser) {
      return 409;
    }
    await users.insertOne({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      permissions: user.permissions,
      year: parseInt(user.year)
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
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const existingUser = await users.findOne({ userId: user.userId });
    if (!existingUser) {
      return 404;
    }
    const chats = db.collection('chats');
    await chats.deleteMany({ userId: user.userId });
    await users.deleteOne({ userId: user.userId });
    return 200;
  }
  catch (error) {
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
    const existingUser = await users.findOne({ userId: user.userId });
    if (!existingUser) {
      return 404;
    }
    await users.updateOne({ existingUser },
      {
        $update: {
          permissions: permissions
        }
      }
    )
  }
  catch (error) {
    console.log(error);
    return 500;
  } finally {
    await client.close();
  }
}

module.exports = {
  getUser,
  getStudents,
  postUser,
  deleteUser,
  changeAdminPermissions,
}