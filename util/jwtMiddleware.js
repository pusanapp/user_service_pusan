const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    console.log(authorization)
    if (!authorization) {
        res.send({
            err: 'no token'
        })
    }

    const [authType, token] = authorization.trim().split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    if (token) {
        jwt.verify(token, process.env.TOKEN_AUTH_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).send({
                    status: false,
                    message: "Invalid Token" + err.message,
                });
            } else {
                next()
            }
        });
    } else {
        res.status(401)
            .send({status: false, message: "Authentication Failed, Token Not Found"});
    }
}
