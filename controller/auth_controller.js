const axios =require('axios')
require('dotenv').config()
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const tokenGenerator = require('../util/tokenGenerator')
const model = require('../models/index')
const UserAuth = model.user_auth;
const UserProfile = model.user_profile;

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
    // const token = await tokenGenerator.generateAuthToken()
    await verify(idToken).then(async (payload)=>{
        const userAvailable = await UserProfile.findOne({
            where: {
                email: payload.email
            },
            include: [
                {
                    model: UserAuth,
                    as: 'user_auth',
                    attributes: {
                        exclude: ['password']
                    }
                }
            ]
        })
        if(userAvailable){
            console.log('user available')
            const token = await tokenGenerator.generateJWTToken(userAvailable)
            res.send({
                status: true,
                message: 'Login Success',
                data: userAvailable,
                token: token
            })
        }else {
            console.log('user not available')
            await UserAuth.create({
                user_id: payload.sub,
                email: payload.email,
                password: 'login_from_google',
                role_id: 1,
            }).then(async (result)=>{
                await UserProfile.create({
                    email: payload.email,
                    auth_id: result.id,
                    full_name: payload.name,
                    profile_picture: payload.picture
                }).then(final => {
                    res.send({
                        status: true,
                        message: 'Login Success',
                        data: final,
                        token: token
                    })
                })
            })
        }
    }).catch(err=>{
        res.send({
            status: false,
            message: `Login Failed, ${err.message}`
        })
    })
}
const verifyLoginFacebook = async (req,res)=>{
    const accessToken = req.body.token;
    // const token = await tokenGenerator.generateAuthToken()
    try{
        const{data: response} = await axios.get(`https://graph.facebook.com/me`,{
            params: {
                fields: 'id,name,email,picture',
                access_token: accessToken
            }
        })
        console.log(response)
        const userAvailable = await UserProfile.findOne({
            where: {
                email: response.email
            },
            include: [
                {
                    model: UserAuth,
                    as: 'user_auth',
                    attributes: {
                        exclude: ['password']
                    }
                }
            ]
        })
        if(userAvailable){
            const token = await tokenGenerator.generateJWTToken(userAvailable)
            console.log('user available')
            res.send({
                status: true,
                message: 'Login Success',
                data: userAvailable,
                token: token
            })
        }else {
            console.log('user not available')
            await UserAuth.create({
                user_id: response.id,
                email: response.email,
                password: 'login_from_facebook',
                role_id: 1,
            }).then(async (result)=>{
                await UserProfile.create({
                    email: response.email,
                    auth_id: result.id,
                    full_name: response.name,
                    profile_picture: response.picture.data.url
                }).then(async final => {
                    const token = await tokenGenerator.generateJWTToken(final)
                    res.send({
                        status: true,
                        message: 'Login Success',
                        data: final,
                        token: token
                    })
                })
            })
        }
        // res.send({
        //     status: true,
        //     message: 'Login Success',
        //     data: response,
        //     token: token
        // })
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

