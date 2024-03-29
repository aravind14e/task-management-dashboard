const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

// Configure MongoDB connection
const uri = "mongodb://a:aravinde10@your_cluster_address:port/your_database_name";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Connected to MongoDB");

  const db = client.db("task-manager"); // Name of your database

  // Route to get all tasks
  app.get('/tasks', (req, res) => {
    db.collection('tasks').find().toArray((err, tasks) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving tasks');
      }
      res.send(tasks);
    });
  });

  // Route to add a task
  app.post('/tasks', bodyParser.json(), (req, res) => {
    const newTask = req.body;
    db.collection('tasks').insertOne(newTask, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).send('Error adding task');
      }
      res.send(result.ops[0]); // Send the newly added task
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
