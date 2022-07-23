const express = require("express")
const rout = express.Router()
const { user } = require("../model/userModel")
const auth = require("../midlleware/auth")
const axious = require("axios")
const CircularJSON = require('circular-json')


rout.get("/weather", async(req, res) => {
    let data = await user.weather()
        // const str = CircularJSON.stringify(data.data);

    return res.status(200).send(data.data.weather)
        // return res.status(200).send(data)
})

rout.get("/", auth, async(req, res) => {
    let data = await user.get()
    return res.status(200).send(data)
})

rout.post("/", async(req, res) => {
    let data = await user.add(req.body)
    return res.status(201).send(data)
})

rout.put("/:id", async(req, res) => {
    let data = await user.put(req.params.id, req.body)
    return res.status(200).send(data)
})

rout.delete("/", async(req, res) => {
    let data = await user.delete(req.body.username)
    return res.status(200).send(data)
})

rout.post("/login", async(req, res) => {
    let { error, data } = await user.login(req.body);
    if (error) {
        return res.status(error.status).send(error.message)
    }
    return res.header("x-auth-token", data).send("perfect")
})

// rout.get("/weather", async(req, res) => {
//     user.weather(function(data) {
//             return res.status(200).json({ data })
//         })

//})

module.exports = rout