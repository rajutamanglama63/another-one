const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const todoRoute = require("./routes/todo");
const authRoute = require("./routes/auth");

const app = express();

dotenv.config();
const Port = process.env.PORT || 4000;

connectDB();

app.use(express.json());

app.use('/todo', todoRoute);
app.use('/auth', authRoute);

app.listen(Port, () => {
    console.log(`Server running on Port http://localhost:${Port}`);
});