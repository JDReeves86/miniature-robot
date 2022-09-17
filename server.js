const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const uuid = require('./helpers/uuid');
const db = require('./db/db.json');

// Middleware to recognize incoming data as a json object, parses the data & and place the parsed data into the request body.
// Necessary for post request to work properly and the post request is sending data structured as an object.
// If not used, notes will save as undefined
app.use(express.json());

// Recognizes incoming data requests formatted as array. db.json saves all objects as items in an array,
// app.use(express.urlencoded({ extended: true }));

// Allows for grabbign of css & index.js files for front end functionality.
app.use(express.static('public'));

// Serves up the index.html file when navigating to the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Serves notes.html when navigating to /notes. Allows the 'Get Started' button to function properly.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Retrieves the data from the db.json file. Parses the data each time the data is requested. If not read & parsed,
// data essentially remains static as it existed at page load and creates odd functionality where items are not
// removed properly. Allows for proper rendering of the saved note list on the left column of th enotes page.
app.get('/api/notes', (req,res) => {
    const data = JSON.parse(fs.readFileSync('./db/db.json'))
    res.json(data) 
});

// Creates a post request to the db.json file retrieved at the db.json file. Takes incoming data and destructures the request body.
// Adds uuid, then retirves the current db.json file, parses the data, pushes the newly received object into the array,
// stringifies the updated array, then rewrites the db.json file witht he new data.
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    const saved = {
        title,
        text,
        id: uuid(),
    }

    const fileData = JSON.parse(fs.readFileSync('./db/db.json'))
    fileData.push(saved)
    const fileString = JSON.stringify(fileData)
    fs.writeFile(`./db/db.json`, fileString, (err) => {
            if (err) console.log('something went wrong', err)
        })

    res.json(db)
})

// Takes a delete request where it reads the current db.json file, then uses the findIndex method to find the item
// in the parsed array with a matching uuid as the clicked id key. If found, it will slice 1 item at the index of the found item.
// It will then stringify and rewrite the updated array to db.json.
app.delete('/api/notes/:id', (req, res) => {
    const fileData = JSON.parse(fs.readFileSync('./db/db.json'))
    const clicked = req.params.id
    let objIndex = fileData.findIndex(obj => obj.id === clicked)
    
    console.log(fileData, objIndex)
    fileData.splice(objIndex, 1)
    const fileString = JSON.stringify(fileData)
    fs.writeFile(`./db/db.json`, fileString, (err) => {
        if (err) console.log('something went wrong', err)
    })
    res.json(db)
})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})