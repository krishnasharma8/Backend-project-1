const express = require('express');
const app = express();
const cors = require('cors');
//const dbConfig = require('./db'); // Make sure your database configuration is correct
const connectDb = require('./db');
const port = process.env.PORT || 5000;

// Import routes
const roomsRoute = require('./routes/roomsRoute');
const usersRoute = require('./routes/usersRoute'); // Ensure the correct path to your users route
const bookingsRoute = require('./routes/bookingsRoute');
// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());
connectDb();
// Define routes
app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute); // Add this line to enable usersRoute
app.use('/api/bookings', bookingsRoute);


// Root route (optional, for testing purposes)
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

// Start the server
app.listen(port, () => console.log('Node Server Started using nodemon on port ${port}'));