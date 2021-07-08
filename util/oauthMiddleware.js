require('dotenv').config()
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-26211979.okta.com/oauth2/default',
    clientId: process.env.CLIENT_ID
})

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        console.log(authorization)
        if (!authorization) {
            res.send({
                err: 'no token'
            })
        }

        const [authType, token] = authorization.trim().split(' ')
        if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

        const { claims } = await oktaJwtVerifier.verifyAccessToken(token, 'api://default')
        console.log(claims)
        if (!claims.scp.includes('my_scope')) {
            throw new Error('Could not verify the proper scope')
        }
        next()
    } catch (error) {
        console.log('ERRRR, ',error.message)
        next(error.message)
    }
}
