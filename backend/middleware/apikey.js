const constants = require("../constants")
const API_KEY = constants.API_KEY

const validateKey = (req, res ,next) => {
    const apiKey = req.header('X-API-KEY');
    const host = req.headers.origin;
    console.log(`Request from host: ${host}`)

    // In a normal environment we will check if the host match the host registered for that particular api key
    if(apiKey === API_KEY){
        next();
        return
    }

    res.status(403).send()
}

module.exports = { validateKey };