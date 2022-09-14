const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;
const path = require('path');
const db = require('./db/db.json');

console.log(__dirname)
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
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    const saved = {
        title,
        text,
    }
    
    const fileData = JSON.parse(fs.readFileSync('./db/db.json'))
    fileData.push(saved)
    
    const fileString = JSON.stringify(fileData)

    fs.writeFile(`./db/db.json`, fileString, (err) => {
            if (err) console.log('something went wrong', err)
        })
})


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})