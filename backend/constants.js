// URI for testing mongo locally mongodb://127.0.0.1:27017/?retryWrites=true&writeConcern=majority

// This information will be un a .env file in a normal development setting
const MONGO_USER = "allfunds";
const MONGO_PASSWORD = "test";
const mongoDbUri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.wxmzm.mongodb.net/?retryWrites=true&w=majority`;

const databaseName = "allfunds";
const collectionName = "news";

// This normally will be in a database encripted or at least in a .env file
const API_KEY = "d7fef19d-3a36-47b0-a271-bf762668d32d";

exports.mongoDbUri = mongoDbUri;
exports.databaseName = databaseName;
exports.collectionName = collectionName;
exports.API_KEY = API_KEY;
