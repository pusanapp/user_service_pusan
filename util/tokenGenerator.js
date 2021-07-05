const axios = require('axios')

const generateAuthToken = async () => {
    try{
        const username = '0oa15ac5v5CLonNa65d7'
        const password = '2DOHeJbWag8PCCR9ypATcjgqX3K7rMfpWCYhK_Rk'
        const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        console.log(token)
        const {data: response} = await axios.post(`https://dev-26211979.okta.com/oauth2/default/v1/token?grant_type=client_credentials&scope=my_scope`,{},{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': `Basic ${token}`
            }
        })
        console.log('Res,',response)
        return response
    }catch (e){
        console.log(e)
    }
}

module.exports = {
    generateAuthToken
}
