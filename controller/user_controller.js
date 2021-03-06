const model = require('../models/index')
const UserAuth = model.user_auth;
const UserProfile = model.user_profile;
const mailTransporter = require('../util/mailerTransport')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {nanoid} = require('nanoid')
const tokenGenerator = require('../util/tokenGenerator')
require('dotenv').config()

const registerUser = async (req, res) => {
    const data = req.body;
    const hash = bcrypt.hashSync(data.password, 10);
    const registerUser = {
        user_id: nanoid(),
        email: data.email,
        password: hash,
        role_id: 1,
    }
    console.log(registerUser)
    await UserAuth.create(registerUser).then(async (result) => {
        const saveUserProfile = {
            auth_id: result.id,
            full_name: data.full_name,
            email: data.email,
            profile_picture: data.profile_picture,
            phone_number: data.phone_number,
            address: data.address,
            district: data.district,
            city: data.city,
            province: data.province,
            gender: data.gender,
            postal_code: data.postal_code,
            district_id: data.district_id
        }
        await UserProfile.create(saveUserProfile).catch(err => {
            res.send({
                status: false,
                message: 'Profile Register Error, '+err.message
            })
        })
        console.log(result)
        const option = mailTransporter.mailOption
        option.to = 'developer.pusan@gmail.com'
        option.subject = 'TEST'
        const token = await tokenGenerator.generatorTokenActivation(result)
        console.log(token)
        option.html = `<html>Test Email For Verification <a href="https://pusanair-dev.xyz/user-service/api/v1/user/activate?token=${token}">Activate User</a></html>`
        await mailTransporter.transport.sendMail(option, (data, err) => {
            if (err) {
                res.send({
                    status: false,
                    message: err.message
                })
            }
        })
        res.send({
            status: true,
            message: 'Register Success'
        })
    }).catch(err => {
        res.send({
            status: false,
            message: 'Auth Register Error, '+err.message
        })
    })
}

const activateUser = async (req, res) => {
    const activateToken = req.query.token
    console.log('TOKEN NYA,', activateToken ? activateToken : "Kosong Token");
    if (activateToken) {
        jwt.verify(activateToken, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.status(200).send({
                    status: false,
                    message: "Activation Account Failed, " + err.message,
                });
            } else {
                const user = decoded.data;
                await UserAuth.update({
                    active: 1
                }, {
                    where: {
                        user_id: user.user_id
                    }
                }).then(rowUpdate => {
                    if (rowUpdate > 0) {
                        res.send({
                            status: true,
                            message: 'Account Activation Success'
                        })
                    }
                }).catch(err => {
                    res.send({err: err.message})
                })
            }
        });
    } else {
        res
            .status(200)
            .send({status: false, message: "Activation Account Failed, token not found"});
    }
}

const loginUser = async (req, res) => {
    const data = req.body
    await UserAuth.findOne({
        where: {
            email: data.email
        },
        include: [
            {
                model: UserProfile,
                as: 'user_profile',
            }
        ]
    }).then(async (result) => {
        if (!result) {
            res.send({
                status: false,
                message: 'Login Failed, Email Not Found'
            })
        }else {
            const passwordCheck = bcrypt.compareSync(data.password, result.password);
            console.log(passwordCheck, 'Password Check')
            if (!passwordCheck) {
                res.send({
                    status: false,
                    message: 'Login Failed, Password Not Match'
                })
            }else if(!result.active){
                res.send({
                    status: false,
                    message: 'Login Failed, Account Non Active'
                })
            }else {
                // const token = await tokenGenerator.generateAuthToken()
                const token = await tokenGenerator.generateJWTToken(result.user_profile)
                await res.send({
                    status: true,
                    message: 'Login Success',
                    data: result.user_profile,
                    token: token
                })
            }

        }
    }).catch(err => {
        console.log(err)
        res.send({
            status: false,
            message: err.message
        })
    })
}
const getUser = async(req, res)=>{
    await UserAuth.findOne({
        where: {
            user_id: req.params.user_id,
        },
        attributes: {
            exclude: ['password']
        },
        include: [
            {
                model: UserProfile,
                as: 'user_profile',
            }
        ]
    }).then(data=>{
        res.send(data)
    })
}


module.exports = {
    registerUser,
    activateUser,
    loginUser,
    getUser
}
