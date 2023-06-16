// Import required modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Create an instance of Express.js
const app = express();

// Set up middleware for parsing JSON data
app.use(express.json());

// Define a mongoose schema for the message collection
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

// Create a mongoose model based on the schema
const Message = mongoose.model("Message", messageSchema);

// Connect to the MongoDB Atlas cluster
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Create a route to handle the form submission
app.post("/submit", async (req, res) => {
  // Retrieve the data from the request body
  const { name, email, subject, message } = req.body;

  // Create a new document with the form data
  const newMessage = new Message({ name, email, subject, message });

  // Save the document to the database
  await newMessage
    .save()
    .then(() => {
      return res.status(200).json({ message: "Message stored successfully" });
    })
    .catch((err) => {
      console.error("Error inserting document:", err);
      return res.status(500).json({ error: "Server error" });
    });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT);
});
