const asyncHandler = require("express-async-handler");
const Admin = require("../model/userModel.js");
const generateToken = require("../util/jwToken.js")

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, role: "admin" });                    //checks if the user exists
    if (admin) {
        if (await admin.matchPassword(password)) {                   //checks if the passwords match
            generateToken(res, admin._id);                                     //generates jwt token
            res.status(201).json({
                message:"Admin has successfully logged in"
            });
        } else {
            res.status(400)
            throw new Error("Invalid email and password")            
        }
    }else{        
        res.status(400)
        throw new Error("Not admin")
    }
})

const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Admin Logged Out" });
});



module.exports = {
    login,
    logout
};
