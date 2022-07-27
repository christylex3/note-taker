
const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const { randomUUID } = require('crypto');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET /notes returns the notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET /api/notes reads the db.json file and returns all saved notes as JSON
app.get('/api/notes', (req, res) => res.json(notes));

// GET * returns the index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    var newNote = {
      title,
      text,
      note_id: randomUUID()
    };
    notes.push(newNote);

    fs.writeFile(`./db/db.json`, JSON.stringify(notes), (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in saving note');
  }


});



app.delete(`/api/notes/:id`, (req, res) => {
  console.log("Deleting");
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)