const { MongoClient } = require('mongodb');


async function getUser(userId) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const user = await users.findOne({ userId: userId });
    if (!user) {
      return { status: 404, user: "User doesn't exist in the database." };
    }
    return { status: 200, user: user };
  } catch (error) {
    return { status: 500, user: error.message };
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
      return { status: 404, students: "No students were found in the database." };
    }
    return { status: 200, students: allStudents };
  } catch (error) {
    return { status: 500, students: error.message };
  } finally {
    await client.close();
  }
}

async function postUser(userId) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const existingUser = await users.findOne({ userId: userId });
    if (existingUser) {
      return { status: 409, error: "User already exists in the database." };
    }
    await users.insertOne({
      userId: userId,
      firstname: "",
      lastname: "",
      password: "12345678",
      permissions: false,
    });
    return { status: 201, error: "" };
  } catch (error) {
    return { status: 500, error: error.message };
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
      return { status: 404, error: "User doesn't exist in the database." };
    }
    const practices = db.collection('practices');
    await practices.deleteMany({ userId: user.userId });
    await users.deleteOne({ userId: user.userId });
    return { status: 200, error: "" };
  }
  catch (error) {
    return { status: 500, error: error.message };
  } finally {
    await client.close();
  }
}

async function changeAdminPermissions(user, permissions) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const existingUser = await users.findOne({ userId: user.userId });
    if (!existingUser) {
      return { status: 404, error: "User doesn't exist in the database." };
    }
    await users.updateOne({ existingUser },
      {
        $set: {
          permissions: permissions
        }
      }
    );
    return { status: 200, error: "" };
  }
  catch (error) {
    return { status: 500, error: error.message };
  } finally {
    await client.close();
  }
}

async function changeUserPassword(user, oldPassword, newPassword) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    if (oldPassword !== user.password) {
      return { status: 403, error: "Old password isn't correct." };
    }
    await users.updateOne({ userId: user.userId },
      {
        $set: {
          password: password
        }
      }
    );
    return { status: 200, error: "" };
  }
  catch (error) {
    return { status: 500, error: error.message };
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
  changeUserPassword,
};