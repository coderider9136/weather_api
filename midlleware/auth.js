const jwt = require("jsonwebtoken")

function auth(req, res, next) {
    let token = req.header("x-auth-token")
    if (!token) {
        return res.status(400).send("bad request")
    }

    let check;
    try {
        check = jwt.verify(token, "key")
    } catch (e) {
        check = false
    }

    if (!check) {
        return res.status(401).send("authenticatio failed")

    }
    req.id = check.id;
    next();
}

module.exports = auth