const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    refreshToken: {
        type: String,
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minlength: [6, "password must be upto 6 characters"],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: false,
        unique: true,
        trim: true,
    },

    tasks: [
        {
            _id: {
                type: Number,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true,
            },
            due_date: {
                type: Date,
                default: () => new Date(Date.now() + 24 * 60 * 1000),
                required: false,
            },
            completed: {
                type: Boolean,
                default: false,
            }

        }
    ],


});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});



module.exports = mongoose.model('User', userSchema);