const asyncHandler = require("express-async-handler");
const Borrow = require("../model/borrowModel.js");
const Book = require("../model/bookModel.js");

const borrowBook = asyncHandler(async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err);
    }

})

const returnBook = asyncHandler(async (req, res) => {
    try {
        const borrowId = req.body.bookId
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
            res.status(400).json({
                message: "You have no history with us. Please start reading"
            });
        }
    } catch (err) {
        console.log(err);
    }
})

const mostBorrowed = asyncHandler(async (req, res) => {
    try {
        const mostBorrowed = await Borrow.aggregate([
            {
                $group: {
                    _id: "$bookId",
                    borrowCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: 0,
                    bookId: "$_id",
                    title: "$bookDetails.title",
                    author: "$bookDetails.author",
                    borrowCount: 1
                }
            }
        ])
        if (mostBorrowed) {
            res.status(200).json({
                mostBorrowed
            });
        } else {
            res.status(400).json({
                message: "No such a book."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
})

const activeMembers = asyncHandler(async (req, res) => {
    try {
        const mostActive = await Borrow.aggregate([
            {
                $group: {
                    _id: "$userId",
                    borrowCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    borrowCount: 1
                }
            }
        ])
        if (mostActive) {
            res.status(200).json({
                mostActive
            });
        } else {
            res.status(400).json({
                message: "No such a person."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
})

const availableBooks = asyncHandler(async (req, res) => {
    try {
        const booksAvailable = await Book.aggregate([
            {
                $lookup: {
                    from: "borrows",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "borrowedBooks"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    totalBooks: "$numberOfCopies",
                    totalBorrowedBooks: { $size: "$borrowedBooks" },
                    totalAvailableBooks: {
                        $subtract: [
                            "$numberOfCopies",
                            { $size: "$borrowedBooks" }
                        ]
                    }
                }
            }
        ]);
        if (booksAvailable) {
            res.status(200).json({
                booksAvailable
            });
        } else {
            res.status(400).json({
                message:"No books available"
            });
        }

    } catch (err) {
        console.log(err);
    }
})

module.exports = {
    borrowBook,
    returnBook,
    borrowHistory,
    mostBorrowed,
    activeMembers,
    availableBooks
}
