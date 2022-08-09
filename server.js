// Packages needed to be installed
const express = require("express");
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");
let notes;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows access to files in public directory
app.use(express.static("public"));

// GET /notes returns the notes.html
app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET /api/notes reads the db.json file and returns all saved notes as JSON
app.get("/api/notes", (req, res) => {
	fs.readFile(`./db/db.json`, (err, data) => {
		if (err) {
			throw err;
		}
		// Stores parsed data into notes
		notes = JSON.parse(data);
		res.json(notes);
	});
});

// GET * returns the index.html
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "/public/index.html"))
);

// POST /api/notes receives a new note to save on the request body, adds it to the db.json file, and then returns the new note to the client
app.post("/api/notes", (req, res) => {
	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all required properties are present
	if (title && text) {
		// Variable for new note that will be saved
		var newNote = {
			title,
			text,
			id: generateUniqueId({
				length: 10,
			}),
		};

		// Grabs the existing notes from db.json 
		fs.readFile(`./db/db.json`, (err, data) => {
			if (err) {
				throw err;
			}
			// Stores parsed data into notes
			notes = JSON.parse(data);

			// Add new note to array of notes
			notes.push(newNote);

			// Writes file again with new note added
			fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, "\t"),
				(err) =>
					err ? console.log(err)
						: console.log(`${newNote.title} has successfully been added to notes.`)
			);

			const response = {
				status: "success",
				body: newNote,
			};

			res.status(201).json(response);
		});
	} else {
		res.status(500).json("Error in saving note");
	}
});

// read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file
app.delete("/api/notes/:id", (req, res) => {
	// Destructuring assignment for the items in req.body
	const { id } = req.params;

	// If id is present
	if (id) {

		// Grabs the existing notes from db.json
		fs.readFile(`./db/db.json`, (err, data) => {
			if (err) {
				throw err;
			}
			// Stores parsed data into notes
			notes = JSON.parse(data);

			// updatedNotes stores all notes but excludes the deleted note with the id
			updatedNotes = notes.filter((note) => note.id != id);

			// Writes file again without the deleted note
			fs.writeFile(`./db/db.json`, JSON.stringify(updatedNotes, null, "\t"),
				(err) =>
					err ? console.log(err)
						: console.log(`Note with ${id} has successfully been deleted.`)
			);

			const response = {
				status: "success",
			};

			res.status(201).json(response);
		});
	} else {
		res.status(500).json("Error in deleting note");
	}
});

// Runs server at PORT
app.listen(PORT, () =>
	console.log(`App listening at http://localhost:${PORT}`)
);
