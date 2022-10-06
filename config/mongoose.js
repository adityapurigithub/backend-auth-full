//cloud mongo
const mongoose = require("mongoose");

const database =
  "mongodb+srv://aditya99:9jvV5kPAHKMFO8pF@cluster0.mcxgo6j.mongodb.net/?retryWrites=true&w=majority";

const db = mongoose
  .connect(database)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Local

// const mongoose = require("mongoose");

// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://localhost:27017/auth");
//   console.log("Connected To DB");
// }
