const mongoose = require("mongoose")

const borrowSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default:""
    }
})

const Borrow = mongoose.model('Borrow', borrowSchema)

module.exports = Borrow