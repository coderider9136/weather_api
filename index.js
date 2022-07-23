const express = require("express")
const app = express()
const mongoose = require("mongoose")
const user = require("./controller/userController")

app.use(express.json())
app.use("/api/user", user)

mongoose
    .connect("mongodb://localhost/weather")
    .then(() => console.log("data base has connected"))
    .catch((err) => console.log(err))



app.listen(4500, () => console.log("server is okey"))