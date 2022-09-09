const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const mockData = require("./mock_data");
const constants = require("./constants");
const bodyParser = require("body-parser");
const cors = require("cors");

// Global constants
const PORT = process.env.PORT || 3050;
const mongoDbUri = constants.mongoDbUri;
const databaseName = constants.databaseName;
const collectionName = constants.collectionName;

// Initializations
const app = express();
const mongoClient = new MongoClient(mongoDbUri);
app.use(bodyParser.json());
app.use(cors());

// To insert mock data for testing porpuses just remove the comment of the insertMockData function

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Endpoint get all news
app.get("/v1/get-all-news", async function (req, res) {
  const allNews = await getAllNews();
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(allNews));
});

//Endpoint archive new
app.put("/v1/archive-new", async function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const date = req.body.date;
  const updateResult = await archiveNew(id, date);
  if (updateResult) {
    res.status(200).send();
  }
  res.status(500).send();
});

//Endpoint Delete new
app.delete("/v1/delete-new/:id", async function (req, res) {
  const { id } = req.params;
  const deleteResult = await deleteNew(id);
  if (deleteResult) {
    res.status(200).send();
  }
  res.status(404).send();
});

const getAllNews = async () => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(databaseName);
    const newsCollection = database.collection(collectionName);
    const resultsCursor = await newsCollection.find();
    const allNews = [];
    await resultsCursor.forEach((result) => {
      allNews.push(result);
    });
    return allNews;
  } catch (error) {
    console.log("Something went bad");
  } finally {
    await mongoClient.close();
  }
};

const archiveNew = async (id, date) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(databaseName);
    const newsCollection = database.collection(collectionName);
    const query = { _id: ObjectId(id) };
    const updateDocument = {
      $set: {
        archiveDate: new Date(2022, 1, 2, 3, 4),
      },
    };
    const result = await newsCollection.updateOne(query, updateDocument);
    return result.acknowledged;
  } catch (error) {
    console.log("error");
  } finally {
    await mongoClient.close();
  }
};

const deleteNew = async (id) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(databaseName);
    const newsCollection = database.collection(collectionName);
    const query = { _id: ObjectId(id) };
    const result = await newsCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error deleting document");
  } finally {
    await mongoClient.close();
  }
};

const insertMockData = async () => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(databaseName);
    const newsCollection = database.collection(collectionName);
    const options = { ordered: true };
    const result = await newsCollection.insertMany(mockData, options);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (error) {
    console.log("Error");
  } finally {
  }
};

//insertMockData();
