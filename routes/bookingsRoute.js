const express = require("express");
const router = express.Router();
// const Booking = require("../models/booking");

router.post("/bookroom", async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalAmount,
        totalDays
    } = req.body;

    try {
        const newBooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            fromdate,
            todate,  // Ensure todate is included
            totalAmount,
            totalDays,
            transactionId: '1234' // Placeholder for transaction ID
        });

        const booking = await newBooking.save();
        res.status(201).json(booking); // Send back the created booking
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while booking the room", error: error.message }); // Send error message
    }
});

module.exports = router;