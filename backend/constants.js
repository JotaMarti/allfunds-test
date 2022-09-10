const mongoDbUri = "mongodb://127.0.0.1:27017/?retryWrites=true&writeConcern=majority";
const databaseName = "allfunds";
const collectionName = "news";

// This normally will be in a database encripted or at least in a .env file
const API_KEY = "d7fef19d-3a36-47b0-a271-bf762668d32d";


exports.mongoDbUri = mongoDbUri;
exports.databaseName = databaseName;
exports.collectionName = collectionName;
exports.API_KEY = API_KEY