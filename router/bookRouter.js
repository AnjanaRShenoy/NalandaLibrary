const express=require ('express')
const router= express.Router()
const bookController=require("../controller/BookController.js")
const {auth,admin}=require('../middleware/authMiddleware.js')

router.post("/addBook",auth,bookController.addBook)
router.put("/updateBook",auth,bookController.updateBook)
router.delete("/deleteBook/:_id",auth,bookController.deleteBook)
router.get("/listBooks",auth,bookController.listBooks)

module.exports = router;