const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'some.new.mail1@gmail.com',
    pass: 'hxqx grrl lieh urdw', // or use an app password for Gmail
  },
});

const sendEmail = (toEmail, subject, html) => {
  const mailOptions = {
    from: 'some.new.mail1@gmail.com',
    to: toEmail,
    subject: subject,
    html: html,
  };

  // 

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


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

async function hashPassword(plainPassword) {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (err) {
    return { status: 500, error: err };
  }
}

async function postUser(user) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const tasks = db.collection('tasks');
    const existingUser = await users.findOne({ userId: user.userId });
    if (existingUser) {
      return { status: 409, error: "User already exists in the database." };
    }

    sendEmail(`${user.email}`, 'Your password for first login',
       `Hello ${user.firstName} ${user.lastName}, your password is: <b>${user.password}</b><br />
       Use this password for your first login to the app.<br />
       We strongly advise you to change this password after you logged in successfully`);

    //Hashing the user's password with salt
    const hashedPassword = await hashPassword(user.password);

    await users.insertOne({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      password: hashedPassword,
      permissions: false,
      year: parseInt(user.year)
    });

    await tasks.updateMany(
      { year: parseInt(user.year) },
      {
        $push: {
          submitList: { userId: user.userId, firstName: user.firstName, lastName: user.lastName, didSubmit: false, canSubmitLate: false },
        },
      },
    )

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

    if (!await bcrypt.compare(oldPassword, user.password)) {
      return { status: 403, error: "Old password isn't correct." };
    }

    // if (oldPassword !== user.password) {
    //   return { status: 403, error: "Old password isn't correct." };
    // }

    const hashedNewPassword = await hashPassword(newPassword)

    await users.updateOne({ userId: user.userId },
      {
        $set: {
          password: hashedNewPassword
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