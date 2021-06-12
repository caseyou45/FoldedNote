const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  note: String,
  identifier: String,
  protected: Boolean,
  password: String,
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
