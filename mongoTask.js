const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database name and collection name
const dbName = 'RestaurantDB';
const collectionName = 'Restaurant';

// File path
const filePath = './restaurant.json';

// Read JSON file
const data = JSON.parse(fs.readFileSync(filePath));

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;

  // Select database and collection
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Insert data into MongoDB
  collection.insertMany(data, (err, result) => {
    if (err) throw err;
    console.log('Data imported successfully');
    client.close();
  });
});
