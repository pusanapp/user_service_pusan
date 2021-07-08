const model = require('../models/index')
const UserAuth = model.user_auth;

const registerUser = async (req, res) => {
    const data =req.body;
    await UserAuth.create(data).then(result=> {

    })
}

module.exports = {

}
