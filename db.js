const mongoose = require("mongoose");

// Use an environment variable for the MongoDB connection string
// var mongoURL ="mongodb+srv://krishnasharma42004:@krishna@mern-rooms.gpdmw.mongodb.net/";
var mongoURL="mongodb+srv://krishnasharma42004:krishna@mern-rooms.gpdmw.mongodb.net/mern-rooms";
mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });
var connection = mongoose.connection;

connection.on('error', () => {
    console.log('MongoDB Connection Failed');
});

connection.on('connected', () => {
    console.log('MongoDB Connection Successful');
});

module.exports = mongoose;
