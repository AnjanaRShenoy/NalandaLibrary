const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../model/userModel.js")

const auth = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");

            if (req.user.isBlocked) {
                return res.redirect("/auth")
            }
            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, invalid token");
        }

    } else {
        res.status(401);
        throw new Error("Not Authorized, no token");
    }

});

module.exports = auth 
