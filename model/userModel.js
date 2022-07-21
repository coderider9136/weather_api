const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const { response, json } = require("express")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLenght: 3,
        maxLenght: 12,
        required: true
    },
    emailid: {
        type: String,
        minLenght: 3,
        maxLenght: 12,
        required: true

    },

    contacinfo: {
        type: Number,
        minLenght: 3,
        maxLenght: 12,
        required: true
    },
    password: {
        type: String,
        minLenght: 8,
        maxLenght: 20,
        required: true
    },
    addeDate: {
        type: Date,
        default: Date.now

    }
})

const userModel = mongoose.model("user", userSchema);

async function addall(param) {
    let salt = await bcrypt.genSalt(10)
    param.password = await bcrypt.hash(param.password, salt)
    let obj = new userModel(param);
    let user;
    try {
        user = await obj.save()
    } catch (err) {
        return handle(err)

    }
    return user
}

async function getall() {
    let user = await userModel.find().catch((err) => { return false })
    if (!user) {
        return { errors: { status: 400, message: "error" } }
    }
    return user
}

async function update(param1, param2) {
    let user = await userModel.findByIdAndUpdate(param1, param2).catch((err) => { return false })
    if (!user) {
        return { errors: { status: 400, message: "error" } }
    }
    return user
}

async function remove(param) {
    let user = await userModel.findOneAndDelete(param).catch((err) => { return false })
    if (!user) {
        return { errors: { status: 400, message: "error" } }
    }
    return user
}

function handle(err) {
    let { errors } = err
    let msg = [];
    for (i in errors) {
        msg.push(errors[i].message)
    }
    return msg
}

async function login(param) {
    let users = await userModel.findOne({ username: param.username }).catch((err) => { return false })
    if (!users) {
        return { errors: { status: 400, message: "invalid user  name" } }
    }
    let check = await bcrypt.compare(param.password, users.password)
    if (!check) {
        return { errors: { status: 401, message: "invalid password or username" } }
    }

    let token = jwt.sign({ id: users._id }, "key")
    return { data: token }

}

// function weather(callback) {
//     axios.get("https://api.openweathermap.org/data/2.5/find?q=mumbai&appid=1a458a68a1919fc0fe181375b3a4b47d")
//         .then(function(result) {
//             return callback(result);
//         }).catch((err) => { console.log(err); })

// }

const url = "http://api.openweathermap.org/data/2.5/weather?q=mumbai&units=metric&appid=8622482995901afdc36c0e598c879054";


async function weather() {
    try {
        const response = await axios.get(url)
        return (response);

    } catch (error) {
        return (error);
    }
}

module.exports = {
    user: {
        get: getall,
        add: addall,
        put: update,
        delete: remove,
        login,
        weather,
    },
    userSchema,
}