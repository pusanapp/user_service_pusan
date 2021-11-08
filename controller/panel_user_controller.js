const model = require('../models/index')
const bcrypt = require("bcrypt");
const tokenGenerator = require("../util/tokenGenerator");
const PanelUser = model.panel_user;

const getAllPanelUser = async (req,res) => {
    await PanelUser.findAll({
        attributes: {exclude: ['password']},
        order: [['id','DESC']]
    }).then(users=>{
        res.send({
            status: true,
            message: 'load all panel users',
            data: users
        })
    }).catch(err => {
        res.send({
            status: false,
            message: 'Error, '+err.message
        })
    })
}

const loginPanelUser = async (req,res) => {
    const {username,password} = req.body;
    await PanelUser.findOne({
        where: {
            username: username
        },
    }).then(async (result)=>{
        if (!result){
            res.send({
                status: false,
                message: 'Login Failed, Username Not Found'
            })
        }else {
            const passwordCheck = bcrypt.compareSync(password, result.password);
            console.log(passwordCheck, ', Password Check Result')
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
                const token = await tokenGenerator.generateJWTToken(result)
                await res.send({
                    status: true,
                    message: 'Login Success',
                    data: result,
                    token: token
                })
            }
        }

    }).catch(err => {
        res.send({
            status: false,
            message: 'Error, '+err.message
        })
    })
}

const addNewUser = async (req,res) => {
    const data = req.body;
    data.password = bcrypt.hashSync(data.password, 10);
    await PanelUser.create(data).then(result=>{
        res.send({
            data: result,
            status: true,
            message: 'User Created'
        })
    }).catch(err => {
        res.send({
            status: false,
            message: 'Error, '+err.message
        })
    })
}

const updateUser = async (req, res) => {
    const data = req.body;
    await PanelUser.update(data, {
        where:{
            id: data.id
        }
    }).then(row => {
        if(row>0){
            res.send({
                status: true,
                message: 'updated user'
            })
        }else {
            res.send({
                status: false,
                message: 'updated failed'
            })
        }
    }).catch(err => {
        res.send({
            status: false,
            message: 'Error, '+err.message
        })
    })
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    await PanelUser.destroy({
        where: {
            id: id
        }
    }).then(result=>{
        if (!result) {
            res.send({
                status: false,
                message: 'Delete Failed',
            })

        } else {
            res.send({
                status: true,
                message: 'Delete Success',
            })
        }
    }).catch(err => {
        res.send({
            status: false,
            message: 'Error, '+err.message
        })
    })
}
module.exports = {
    addNewUser,
    updateUser,
    deleteUser,
    loginPanelUser,
    getAllPanelUser
}
