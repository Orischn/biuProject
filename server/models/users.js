const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const fs = require('fs');
const os = require('os');
require('dotenv').config();
const MAIL_PASSWORD = process.env.MAIL_APP_PASSWORD;

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'some.new.mail1@gmail.com',
    pass: MAIL_PASSWORD,
  },
});

const sendEmail = (toEmail, subject, html, cid) => {
  const mailOptions = {
    from: 'some.new.mail1@gmail.com',
    to: toEmail,
    subject: subject,
    html: html,
    attachments: [{
      filename: 'welcomePic.png',
      path: 'welcomePic.png',
      cid: cid // Use the same CID here
    }]
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
  let validIds = [];

  // Load valid IDs when the server starts
  fs.readFile('validIds.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading ID file', err);
    } else {
      validIds = data.split(os.EOL).map(id => id.trim());
    }
  });

  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    const db = client.db('ChatBot');
    const users = db.collection('users');
    const tasks = db.collection('tasks');
    const existingUser = await users.findOne({ userId: user.userId });
    if (existingUser) {
      return { status: 409, error: "This user ID already exists!" };
    }

    if (!validIds.includes(user.userId)) {
      return { status: 400, error: "This ID number isn't allowed!" }
    }

    const cid = 'welcome@image';

    if (user.isSelfRegistered) {
      sendEmail(`${user.email}`, 'Registration Completed Successfully',
        `Hello ${user.firstName} ${user.lastName}! <br />
        You successfully registered to the medical history questioning practice system 
        of the School of Optometry and Vision Science, Bar Ilan university.<br />
        Those are the details you provided in your registration: <br />
        <b>full name: ${user.firstName} ${user.lastName}</b><br />
        <b>ID number: ${user.userId}</b><br />
        We hope you will enjoy using our system, Good Luck! <br /><br />
        <center><img src="cid:${cid}" /></center>`);
    } else {
      sendEmail(`${user.email}`, 'Your password for first login',
        `Hello ${user.firstName} ${user.lastName}! <br />
        You were successfully added to the medical history questioning practice system 
        of the School of Optometry and Vision Science, Bar Ilan university.<br />
        Those are the details provided in the registration: <br />
        <b>full name: ${user.firstName} ${user.lastName}</b><br />
        <b>ID number: ${user.userId}</b><br />
        <h2>your password for the first login is: <b>${user.password}</b></h2><br />
        Use this password for your first login to the app.<br />
        We strongly advise you to change this password after you logged in successfully <br />
        We hope you will enjoy using our system, Good Luck! <br /><br />
        <center><img src="cid:${cid}" /></center>`);
    }



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
          submitList: {
            userId: user.userId, firstName: user.firstName, lastName: user.lastName,
            didSubmit: false, canSubmitLate: false, grade: null
          },
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
    const tasks = db.collection('tasks');
    const existingUser = await users.findOne({ userId: user.userId });
    if (!existingUser) {
      return { status: 404, error: "User doesn't exist in the database." };
    }
    const practices = db.collection('practices');
    await practices.deleteMany({ userId: user.userId });
    await users.deleteOne({ userId: user.userId });

    await tasks.updateMany(
      { 'submitList.userId': user.userId },
      {
        $pull: {
          submitList: { userId: user.userId },
        },
      },
    )


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
      return { status: 400, error: "Old password isn't correct." };
    }

    // if (oldPassword !== user.password) {
    //   return { status: 400, error: "Old password isn't correct." };
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