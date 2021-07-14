const axios =require('axios')
require('dotenv').config()
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const tokenGenerator = require('../util/tokenGenerator')

async function verify(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    console.log('PAYLOAD GOOGLE, ',payload)
    return payload
}

const verifyLoginGoogle = async (req, res)=>{
    const data = req.body;
    const idToken = data.token
    const token = await tokenGenerator.generateAuthToken()
    await verify(idToken).then(payload=>{
        res.send({
            status: true,
            message: 'Login Success',
            data: payload,
            token: token
        })
    }).catch(err=>{
        res.send({
            status: false,
            message: `Login Failed, ${err.message}`
        })
    })
}
const verifyLoginFacebook = async (req,res)=>{
    const accessToken = req.body.token;
    const token = await tokenGenerator.generateAuthToken()
    try{
        const{data: response} = await axios.get(`https://graph.facebook.com/me`,{
            params: {
                fields: 'id,name,email,picture',
                access_token: accessToken
            }
        })
        console.log(response)

        res.send({
            status: true,
            message: 'Login Success',
            data: response,
            token: token
        })
    }catch (err){
        res.send({
            status: false,
            message: `Login Failed, ${err.message}`
        })
    }
}

module.exports = {
    verifyLoginGoogle,
    verifyLoginFacebook
}

