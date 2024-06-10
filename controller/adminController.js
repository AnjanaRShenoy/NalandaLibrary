const asyncHandler = require("express-async-handler");
const Admin = require("../model/userModel.js");
const generateToken = require("../util/jwToken.js")

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email, role: "admin" });                    //checks if the user exists
    if (user) {
        if (await user.matchPassword(password)) {                   //checks if the passwords match
            generateToken(res, user._id);                                     //generates jwt token
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
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
    res.status(200).json({ message: "User Logged Out" });
});



module.exports = {
    login,
    logout
};
