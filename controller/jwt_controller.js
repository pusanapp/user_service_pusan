const jwt = require("jsonwebtoken");

const checkJWTToken = async (req,res) => {
    const token = req.body.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_AUTH_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).send({
                    status: false,
                    message: "Invalid Token " + err.message,
                });
            } else {
                res.status(200).send({
                    status: true,
                    message: "Token Valid"
                })
            }
        });
    } else {
        res.status(401)
            .send({status: false, message: "Authentication Failed, Token Not Found"});
    }
}

module.exports = {
    checkJWTToken
}
