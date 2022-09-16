const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const uuid = require('./helpers/uuid');
const db = require('./db/db.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req,res) => {
    res.json(db) 
    // fs read and parse to ensure updated information is called each time.
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    const saved = {
        title,
        text,
        id: uuid(),
    }
    
    const response = {
        status: 'success',
        body: saved
    }

 

    const fileData = JSON.parse(fs.readFileSync('./db/db.json'))
    fileData.push(saved)
    const fileString = JSON.stringify(fileData)
    fs.writeFile(`./db/db.json`, fileString, (err) => {
            if (err) console.log('something went wrong', err)
        })

    console.log(saved)
    // sedn arr or note
    res.json(saved)
})

app.delete('/api/notes/:id', (req, res) => {
    const clicked = req.params.id
    let objIndex = db.findIndex(obj => obj.id === clicked)
    const fileData = JSON.parse(fs.readFileSync('./db/db.json'))
    fileData.splice(objIndex, 1)
    const fileString = JSON.stringify(fileData)
    fs.writeFile(`./db/db.json`, fileString, (err) => {
        if (err) console.log('something went wrong', err)
    })
    res.sendFile(path.join(__dirname, './public/notes.html'))
})


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})