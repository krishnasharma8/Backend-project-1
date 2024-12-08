const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database Connected: ", connect.connection.name);
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

module.exports = connectDb;
