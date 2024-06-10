const asyncHandler = require("express-async-handler");
const Book = require("../model/bookModel.js")

const addBook = asyncHandler(async (req, res) => {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } = req.body
    const newBook = await Book.create({
        title,
        author,
        ISBN,
        publicationDate,
        genre,
        numberOfCopies
    })
    res.status(201).json({
        message: "Book has been entered"
    });
})

const updateBook = asyncHandler(async (req, res) => {

    const book = await Book.findById(req.body._id)
    if (book) {
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.ISBN = req.body.ISBN || book.ISBN
        book.publicationDate = req.body.publicationDate || book.publicationDate
        book.genre = req.body.genre || book.genre
        book.numberOfCopies = req.body.numberOfCopies || book.numberOfCopies

        const updatedBook = await book.save()
        res.status(200).json({
            _id: updatedBook._id,
            title: updatedBook.title,
            author: updatedBook.author,
            ISBN: updatedBook.ISBN,
            publicationDate: updatedBook.publicationDate,
            genre: updatedBook.genre,
            numberOfCopies: updatedBook.numberOfCopies,
            message: "Book has been updated"
        })

    } else {
        res.status(404)
        throw new Error('Book Not Found')
    }
})

const deleteBook = asyncHandler(async (req, res) => {
    try {
        console.log(req.params, "book to be deleted");
        const book = await Book.findById(req.params._id)
        if (book) {
            const del = await Book.findByIdAndDelete(req.params._id)
            res.status(200).json({ message: "Book has been deleted" })
        } else {
            res.status(400).json({ message: "Book not found" })
        }
    } catch (err) {
        console.log(err);
    }
})

const listBooks= asyncHandler(async(req,res)=>{
    try{
        const book = await Book.find()
        res.status(201).json({       
            book         
        });
    }catch(err){
        console.log(err);
    }
})


module.exports = {
    addBook,
    updateBook,
    deleteBook,
    listBooks
}
