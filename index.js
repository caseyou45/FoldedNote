const express = require("express");
const cors = require("cors");
const Note = require("./models/notes");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3001;

//Enable Password Protection
app.post("/api/note/password/enable", async (req, res) => {
  const query = { _id: req.body._id };
  const options = { returnNewDocument: true };
  bcrypt.hash(
    req.body.password,
    Number(process.env.HASH_ROUNDS),
    async (err, hash) => {
      try {
        const updateDoc = {
          $set: {
            protected: true,
            password: hash,
          },
        };
        const result = await Note.findOneAndUpdate(query, updateDoc, options);
        console.log(result);
        if (result) res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
});

//Change Password
app.post("/api/note/password/change", async (req, res) => {
  const { identifier, currentPassword, newPassword } = req.body;
  // Find note and authenticate old password
  Note.findOne({ identifier: identifier }, (err, note) => {
    if (note) {
      bcrypt.compare(currentPassword, note.password).then((result) => {
        if (result) {
          const query = { identifier: identifier };
          const options = { returnNewDocument: true };
          // Hash new password
          bcrypt.hash(
            newPassword,
            Number(process.env.HASH_ROUNDS),
            async (err, hash) => {
              try {
                const updateDoc = {
                  $set: {
                    protected: true,
                    password: hash,
                  },
                };
                // Save new note with new password
                const result = await Note.findOneAndUpdate(
                  query,
                  updateDoc,
                  options
                );
                if (result) res.json(result);
              } catch (error) {
                next(error);
              }
            }
          );
        } else {
          res.status(401).send({
            error: `Error: Incorrect Password`,
          });
        }
      });
    } else {
      res.json("No Note Found");
    }
  });
});

//Disable Password Protection
app.post("/api/note/password/disable", async (req, res) => {
  const { identifier, password } = req.body;
  // Find note and authenticate old password
  Note.findOne({ identifier: identifier }, (err, note) => {
    if (note) {
      bcrypt.compare(password, note.password, async (err, result) => {
        if (result) {
          const query = { identifier: identifier };
          const options = { returnNewDocument: true };
          const updateDoc = {
            $set: {
              protected: false,
              password: "",
            },
          };
          // Save new note with new password
          const updatedNote = await Note.findOneAndUpdate(
            query,
            updateDoc,
            options,
            (err, newNote) => {
              if (newNote) {
                res.json(newNote);
              }
            }
          );
        } else {
          res.status(401).send({
            error: `Error: Incorrect Password`,
          });
        }
      });
    } else {
      res.json("No Note Found");
    }
  });
});

// Save Note

app.post("/api/note/save", async (req, res) => {
  const filter = { _id: req.body._id };
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      note: req.body.note,
    },
  };
  const result = await Note.updateOne(filter, updateDoc, options);
  if (result) res.json(result);
});

// Delete Note and return true if successful

app.post("/api/note/delete", async (req, res) => {
  const result = await Note.findByIdAndDelete(req.body._id);
  if (result) {
    res.json(true);
  }
  res.json(result);
});

// Find exisitng Note and return wanring if Password Protected

app.get("/api/note/:id", (req, res) => {
  Note.findOne({ identifier: req.params.id }, (err, note) => {
    if (note) {
      if (note.protected) {
        res.status(403).send({
          error: `Password Protected`,
        });
      } else {
        res.json(note);
      }
    } else {
      res.json("none");
    }
  });
});

// Find exisitng Note with Password Check

app.post("/api/note/fetch_secure", (req, res) => {
  let { password, identifier } = req.body;
  Note.findOne({ identifier: identifier }, (err, note) => {
    if (note) {
      bcrypt.compare(password, note.password).then((result) => {
        if (result) {
          res.json(note);
        } else {
          res.status(401).send({
            error: `Error: Incorrect Password`,
          });
        }
      });
    } else {
      res.json("No Note Found");
    }
  });
});

// New Note
app.post("/api/note", async (req, res) => {
  const note = new Note({
    note: "",
    identifier: req.body.identifier,
    protected: false,
    password: "",
  });
  const savedNote = await note.save();
  res.json(savedNote);
});

// Exprees will serve up production assets
app.use(express.static("build"));

// Express serve up index.html file if it doesn't recognize route
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
