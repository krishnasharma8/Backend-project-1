const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    maxcount: {
        type: Number,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },
    rentperday: {
        type: Number,
        required: true,
    },
    imageurls: [],
    currentbookings: [
        {
            bookingid: { type: String, required: true },
            userid: { type: String, required: true },
            fromdate: { type: String, required: true },
            todate: { type: String, required: true },
            description: { type: String }, // Optional field for description
            status: {
                type: String,
                required: true,
                default: "booked",  // Default status for bookings
            },
        }
    ],
    
    type: {
        type: String,
        required: true,
    },
    description: { 
        type: String,
        required: true }

}, {
    timestamps: true,
});

const Room = mongoose.model("rooms", roomSchema);
module.exports = Room;