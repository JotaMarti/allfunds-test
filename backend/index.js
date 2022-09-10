const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const mockData = require("./mock_data");
const constants = require("./constants");
const bodyParser = require("body-parser");
const cors = require("cors");
const API = require("./middleware/apikey");

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

// This program insert automaticlly mock data in the database if it is empty
// Using mongoDb driver 4.9 compatible with mongo version 3.6 till 6.0

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Endpoint get all news
app.get("/v1/get-all-news", API.validateKey, async function (req, res) {
  const allNews = await getAllNews();
  if (allNews) {
    res.status(200).send(JSON.stringify(allNews));
  }
  res.status(500).send();
});

//Endpoint archive new
app.put("/v1/archive-new", API.validateKey, async function (req, res) {
  const id = req.body.id;
  const date = req.body.archiveDate;
  const updateResult = await archiveNew(id, date);
  if (updateResult) {
    res.status(200).send();
  }
  res.status(500).send();
});

//Endpoint Delete new
app.delete("/v1/delete-new/:id", API.validateKey, async function (req, res) {
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
    console.log("Something went bad getting al the news");
    return null;
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
    const archiveDate = new Date(date);
    const updateDocument = {
      $set: {
        archiveDate,
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
    return result.deletedCount === 1;
  } catch (error) {
    console.log("Error deleting document");
  } finally {
    await mongoClient.close();
  }
};

const checkInitialValuesInDatabase = async () => {
  const allNews = await getAllNews();
  if (allNews) {
    if (allNews.length === 0) {
      console.log("Empty database, inserting mock data...");
      await insertMockData();
      const insertedNews = await getAllNews();
      if (insertedNews) {
        if (insertedNews.length > 0) {
          console.log("Mock data inserted correctly");
        }
        if (insertedNews.length === 0) {
          console.log("Error inserting mock data");
        }
      } else {
        console.log("Error inserting mock data");
      }
    }
  } else {
    console.log("Error inserting mock data");
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
    console.log("Error inserting mock data");
  } finally {
    await mongoClient.close();
  }
};

checkInitialValuesInDatabase();