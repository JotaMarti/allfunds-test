import axios from "axios";

const { GET_ALL_NEWS_URL, ARCHIVE_NEW_URL, DELETE_NEW_URL, headers } = require("../util/constants");

const getAllNewsFromApi = async () => {
  const allNewsResponse = await axios.get(GET_ALL_NEWS_URL, headers).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  });
  return allNewsResponse;
};

const archiveNewFromApi = async (idNewToArchive) => {
  const payload = {
    id: idNewToArchive,
    archiveDate: new Date(Date.now()),
  };
  const archiveNewResponse = await axios.put(ARCHIVE_NEW_URL, payload, headers).then((response) => {
    if (response.status === 200) {
      return true
    } else {
      throw new Error();
    }
  });
  return archiveNewResponse;
};

const deleteNewFromApi = async (idNewToRemove) => {
  axios.delete(DELETE_NEW_URL + idNewToRemove, headers).then((response) => {
    if (response.status === 200) {
      return true;
    } else {
      throw new Error();
    }
  });
};

// Exports
export { getAllNewsFromApi, archiveNewFromApi, deleteNewFromApi };
