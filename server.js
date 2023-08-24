const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

const uuid = require('./uuid');
const note = require("./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {

  console.info(`${req.method} request received`);
  res.json(note);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received`);


  const newInput = req.body;
console.log(newInput);
  if (newInput) {
    const newNote = {
      title: newInput.title,
      text: newInput.text,
      id: uuid(),
    };

    note.push(newNote)
    console.log(note);
    const noteString = JSON.stringify(note, null, 2);

    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
          `${newNote.title} has been written to JSON file`
        )
    );

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in adding new note');
  }
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Note Taking app listening at http://localhost:${PORT}`)
);