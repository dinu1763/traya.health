const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3001;
const MONGODB_URI =
  "mongodb+srv://dinu1763:Kums1763@dinucluster.nfiiq.mongodb.net/?retryWrites=true&w=majority"; // MongoDB connection URI

// CORS middleware
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://dainty-kulfi-e207ed.netlify.app/"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Handle form submission
app.post("/submit-feedback", (req, res) => {
  const rating = req.body.rating;
  const comment = req.body.comment;

  // Save the feedback to MongoDB
  saveFeedbackToMongoDB(rating, comment)
    .then(() => {
      res.send("Thank you for your feedback!");
    })
    .catch((error) => {
      console.error("Error saving feedback to MongoDB:", error);
      res.status(500).send("Error saving feedback.");
    });
});

// GET request to fetch all feedbacks
app.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await fetchFeedbacksFromMongoDB();
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks from MongoDB:", error);
    res.status(500).send("Error fetching feedbacks.");
  }
});

// Function to save the feedback to MongoDB
async function saveFeedbackToMongoDB(rating, comment) {
  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the feedbacks collection
    const feedbacksCollection = client.db().collection("feedbacks");

    // Create a new feedback document
    const feedback = {
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    // Insert the feedback document into the collection
    await feedbacksCollection.insertOne(feedback);
    console.log("Feedback saved to MongoDB successfully!");
  } finally {
    // Close the connection
    await client.close();
  }
}

// Function to fetch all feedbacks from MongoDB
async function fetchFeedbacksFromMongoDB() {
  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the feedbacks collection
    const feedbacksCollection = client.db().collection("feedbacks");

    // Fetch all feedback documents from the collection
    const feedbacks = await feedbacksCollection.find().toArray();
    console.log("Feedbacks fetched from MongoDB successfully!");

    return feedbacks;
  } finally {
    // Close the connection
    await client.close();
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//mongodb+srv://dinu1763:Kums1763@dinucluster.nfiiq.mongodb.net/?retryWrites=true&w=majority
