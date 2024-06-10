const express = require("express");
const userRouter = require('./router/userRouter.js');
const adminRouter = require('./router/adminRouter.js');
const bookRouter = require('./router/bookRouter.js');
const borrowRouter = require('./router/borrowRouter.js');
const { pageNotFound, errorHandler } = require('./middleware/errorMiddleware.js');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const connectDB = require("./connection/db.js");
const dotenv = require('dotenv').config();
const port = process.env.PORT;
connectDB();

// Place cookie-parser middleware before your routes
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/book", bookRouter);
app.use("/api/borrow", borrowRouter);

app.use(pageNotFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
