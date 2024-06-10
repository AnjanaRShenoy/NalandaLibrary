const asyncHandler = require("express-async-handler");
const Borrow = require("../model/borrowModel.js");
const Book = require("../model/bookModel.js");

const borrowBook = asyncHandler(async (req, res) => {
    const { userId, bookId } = req.body
    const book = await Book.findById({ _id: bookId })
    if (book.numberOfCopies > 0) {
        const borrow = await Borrow.create({
            userId,
            bookId,
        });
        await Book.updateOne({ _id: bookId }, { $inc: { numberOfCopies: -1 } });
        if (borrow) {
            res.status(200).json({ message: 'You have borrowed a book' })
        } else {
            res.status(400).json({ message: "User or Book invalid" })
        }
    } else {
        res.status(400);
        throw new Error("Sorry, the book is out of stock");
    }
})

const returnBook = asyncHandler(async (req, res) => {
    try {
        const borrowId = req.body.borrowId
        const borrow = await Borrow.findById(borrowId)
        if (borrow) {
            borrow.returnDate = Date.now();
            const returnBook = await borrow.save();
            await Book.updateOne({ _id: borrow.bookId }, { $inc: { copies: 1 } });

            res.status(200).json({
                message: "Thankyou for returning the book"
            });
        } else {
            res.status(404);
            throw new Error('Borrow record not found');
        }
    } catch (err) {
        console.log(err);
    }
})

const borrowHistory = asyncHandler(async (req, res) => {
    try {
        const userId = req.body.userId
        const borrow = await Borrow.find({ userId })
        if (borrow.length > 0) {
            res.status(200).json({
                borrow
            });
        } else {
            res.status(200).json({
                message: "You have no history with us. Please start reading"
            });
        }
    } catch (err) {
        console.log(err);
    }
})

const mostBorrowed = asyncHandler(async (req, res) => {
    console.log("most popular book");
})

const activeMembers = asyncHandler(async (req, res) => {
    console.log("most active members");
})

const availableBooks = asyncHandler(async (req, res) => {
    console.log("available books");
})


module.exports = {
    borrowBook,
    returnBook,
    borrowHistory,
    mostBorrowed,
    activeMembers,
    availableBooks
}
