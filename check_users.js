const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electricitydb')
  .then(async () => {
    console.log("Connected to DB");
    const users = await User.find({}, 'name email role area');
    console.log("USERS:");
    console.log(users);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });
