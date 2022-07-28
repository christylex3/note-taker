// Packages needed to be installed
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const generateUniqueId = require("generate-unique-id");

console.log(notes);


const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET /notes returns the notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET /api/notes reads the db.json file and returns all saved notes as JSON
app.get("/api/notes", (req, res) => res.json(notes));
// app.get("/api/notes", (req, res) => {
//   fs.readFileSync("./db/db.json", "utf8", (err, data) => {
//     res.json(notes);
//   })
// });

// GET * returns the index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post("/api/notes", (req, res) => {

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all required properties are present
  if (title && text) {

    // Variable for new note that will be saved
    var newNote = {
      title,
      text,
      note_id: generateUniqueId({
        length: 10
      })
    };

    // Add new note to array of notes
    notes.push(newNote);

    // Writes file again with new note added
    fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, "\t"), (err) =>
      err
        ? console.log(err)
        : console.log(`${newNote.title} has successfully been added to notes.`)
    );

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in saving note");
  }
});



app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    const { title, text, id } = req.body;
    notes.splice(req.body, 1);
    console.log(notes);
  });
});

// notes.delete(id, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     res.send({ message: "Note deleted!"})
//   }
// })

//   notes.destroy({
//     where: {
//       note_id: req.params.note_id,
//     },
//   })
//     .then((deletedNote) => {
//       res.json(deletedNote);
//     })
//     .catch((err) => res.json(err));


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)