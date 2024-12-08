
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // Default role is 'user'
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
