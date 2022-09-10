// Endpoints
const BASE_URL = "http://127.0.0.1:3050/v1";
const GET_ALL_NEWS_URL = BASE_URL + "/get-all-news";
const ARCHIVE_NEW_URL = BASE_URL + "/archive-new";
const DELETE_NEW_URL = BASE_URL + "/delete-new/";

// Constants and utils
const headers = {
  headers: {
    // The api key would be normally in a .env file
    "X-API-KEY": "d7fef19d-3a36-47b0-a271-bf762668d32d",
  },
};

const archivedDateDefaultYear = 9000;


// Exports
exports.GET_ALL_NEWS_URL = GET_ALL_NEWS_URL
exports.ARCHIVE_NEW_URL = ARCHIVE_NEW_URL
exports.DELETE_NEW_URL = DELETE_NEW_URL
exports.headers = headers
exports.archivedDateDefaultYear = archivedDateDefaultYear;