const express = require('express');
const router = express.Router();
const Room = require('../models/room'); // Make sure the path to the Room model is correct

// Route to get all rooms
router.get('/getallrooms', async (req, res) => {
    try {
        const rooms = await Room.find({}); // Fetch all rooms from the database
        res.send(rooms); // Return the rooms in the response
    } catch (error) {
        return res.status(400).json({ message: error }); // Send error message if something goes wrong
    }
});

// Route to get room details by ID
router.post('/getroombyid', async (req, res) => {
    const { roomid } = req.body; // Extract roomid from the request body
    try {
        const room = await Room.findById(roomid); // Find room by its ID
        if (!room) {
            return res.status(404).json({ message: 'Room not found' }); // Return 404 if room not found
        }
        res.json(room); // Return the room data in the response
    } catch (error) {
        return res.status(500).json({ message: 'Server error' }); // Return server error if something goes wrong
    }
});

router.post("/addroom", async (req, res) => {
    try {
      console.log('Incoming Request:', req.body); // Log incoming request
      const newroom = new Room(req.body);
      await newroom.save();
      res.send('New Room Added Successfully');
    } catch (error) {
      console.error('Error Adding Room:', error); // Log detailed error
      return res.status(400).json({ message: error.message });
    }
  });
  


module.exports = router;