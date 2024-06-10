const express=require ('express')
const router= express.Router()
const userController=require('../controller/userController.js')

router.get("/hi",userController.addUser)

module.exports = router;