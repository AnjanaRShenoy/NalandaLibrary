const express=require ('express')
const router= express.Router()
const borrowController=require("../controller/borrowController.js")
const {auth,admin}=require('../middleware/authMiddleware.js')

router.post("/borrowBook",auth,borrowController.borrowBook)
router.post("/returnBook",auth,borrowController.returnBook)
router.get("/borrowHistory",auth,borrowController.borrowHistory)


module.exports = router;