// This normally will be in a database encripted or at least in a .env file
const API_KEY = "d7fef19d-3a36-47b0-a271-bf762668d32d"


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