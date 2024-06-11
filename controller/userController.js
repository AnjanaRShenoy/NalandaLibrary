const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");
const generateToken = require("../util/jwToken.js")

const signup = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExist = await User.findOne({ name, email })
        if (userExist) {
            console.log("user exists");
            res.status(400)
            throw new Error('user exists')
        } else {
            const user = await User.create({ name, email, password })
            res.status(201).json({
                message: "User has been registered"
            });
        }
    } catch (err) { console.log(err); }

})

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });                    //checks if the user exists
        if (user && (await user.matchPassword(password))) {                   //checks if the passwords match
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
    } catch (err) {
        console.log(err);
    }

})

const logout = asyncHandler(async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "User Logged Out" });
    } catch (err) {
        console.log(err);
    }

});



module.exports = {
    signup,
    login,
    logout
};
