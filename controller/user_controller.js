const model = require('../models/index')
const UserAuth = model.user_auth;
const mailTransporter = require('../util/mailerTransport')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {nanoid} = require('nanoid')
const tokenGenerator = require('../util/tokenGenerator')
require('dotenv').config()

const registerUser = async (req, res) => {
    const data =req.body;
    const hash = bcrypt.hashSync(data.password, 10);
    const registerUser = {
        user_id: nanoid(),
        email: data.email,
        password: hash,
        role_id: 1,
    }
    console.log(registerUser)
    await UserAuth.create(registerUser).then(async (result)=> {
        console.log(result)
        const option = mailTransporter.mailOption
        option.to = 'developer.pusan@gmail.com'
        option.subject = 'TEST'
        const token = await tokenGenerator.generatorTokenActivation(result)
        console.log(token)
        option.html = `<html>Test Email For Verification <a href="http://116.193.191.200/user-service/api/v1/user/activate?token=${token}">Activate User</a></html>`
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
    }).catch(err=>{
        res.send({
            status: false,
            message: err.message
        })
    })
    res.send({ok:'ok'})
}

const activateUser = async (req,res) => {
    const activateToken = req.query.token
    console.log('TOKEN NYA,',activateToken ? activateToken : "Kosong Token");
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
                },{
                    where: {
                        user_id: user.user_id
                    }
                }).then(rowUpdate=>{
                    if(rowUpdate>0){
                        res.send({
                            status: true,
                            message: 'Account Activation Success'
                        })
                    }
                }).catch(err=>{
                    res.send({err: err.message})
                })
            }
        });
    } else {
        res
            .status(200)
            .send({ status: false, message: "Activation Account Failed, token not found" });
    }
}

const loginUser = async (req,res) => {
    const data = req.body
    await UserAuth.findOne({
        where:{
            email: data.email
        }
    }).then(async (result)=>{
        if(!result){
            res.send({
                status: false,
                message: 'Login Failed, Email Not Found'
            })
        }

        const passwordCheck = bcrypt.compareSync(data.password, result.password);
        console.log(passwordCheck,'Password Check')
        if(!passwordCheck){
            res.send({
                status: false,
                message: 'Login Failed, Password Not Match'
            })
        }

        if(!result.active){
            res.send({
                status: false,
                message: 'Login Failed, Account Non Active'
            })
        }

        try {
            const token = await tokenGenerator.generateAuthToken()
            await res.send({
                status: true,
                message: 'Login Success',
                token: token
            })
        }catch (e) {
            res.send({
                status: false,
                message: e.message
            })
        }
    }).catch(err=>{
        res.send({
            status: false,
            message: err.message
        })
    })
}



module.exports = {
    registerUser,
    activateUser,
    loginUser
}
