
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

const Room = require("../models/room"); // Keep this if needed
const { v4: uuidv4 } = require("uuid"); // Keep this if needed
const stripe = require("stripe")("sk_test_51QQFicDbyunLPozjFJjZ9K6ggS7RuXPVQrZ6mGTZLFYqhkIImQGL6XW1lbTru2C66Td8Egix2Rt47wttVmw4iD7O0050NogSwK");

// Book Room Route
router.post("/bookroom", async (req, res) => {
  const { roomid, userid, fromdate, todate, totalAmount, totalDays, token } = req.body;

  if (!roomid || !userid || !fromdate || !todate || !totalAmount || !totalDays || !token) {
    return res.status(400).json({ message: "All booking details and token are required." });
  }

  try {
    const room = await Room.findById(roomid);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const customer = await stripe.customers.create({
      email: token.email,
    });

    await stripe.paymentMethods.attach(token.id, {
      customer: customer.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "inr",
      customer: customer.id,
      payment_method: token.id,
      receipt_email: token.email,
      description: `Booking for room ${roomid}`, // Corrected here
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === "succeeded") {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totalAmount,
        totalDays,
        transactionId: paymentIntent.id,
      });

      await newBooking.save();

      room.currentbookings.push({
        bookingid: newBooking._id,
        fromdate,
        todate,
        userid,
      });
      await room.save();

      res.status(200).json({
        success: true,
        message: "Booking successful!",
      });
    } else {
      res.status(500).json({ message: "Payment failed" });
    }
  }
  
  catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});

// Other routes remain unchanged
router.post("/getbookingsbyuserid", async (req, res) => {
  const { userid } = req.body;

  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const bookings = await Booking.find({ userid });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching bookings", error: error.message });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingid });
    if (!bookingItem) {
      return res.status(404).json({ message: "Booking not found" });
    }

    bookingItem.status = 'CANCELLED';
    await bookingItem.save();

    const room = await Room.findOne({ _id: roomid });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedBookings = room.currentbookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid.toString()
    );
    room.currentbookings = updatedBookings;
    await room.save();

    res.status(200).json({ message: "Your booking has been cancelled" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: "An error occurred while fetching bookings" });
  }
});

module.exports = router;
