const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    ISBN: {
        type: Number,
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    numberOfCopies: {
        type: Number,
        required: true
    }

})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book