const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const gTTS = require('gtts');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'vatask2_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to mysql database');
});

app.post('/admin', (req, res) => {
    let data = {
        name: req.body.name,
        text: req.body.text
    };
    var gtts = new gTTS(text, 'en');
    
    gtts.save('$uuidno.mp3', function (err, result){
        if(err) { throw new Error(err); }
        console.log('$uuid audio file created');
    });

    let sql = 'INSERT INTO users SET ?';
    let query = connection.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Data inserted successfully');
    });

});

app.get('/', (req, res) => {
    res.send(`
        <form action="/input" method="post">
        <input type="text" name="userInput">
        <input type="submit" value="Submit">
        </form>
    `);
});

// Table 1 __ POST /admin
// Primary Key, Admin Name, Text, UUID

// Table 2 __ POST /input
// Primary Key, User Name, Text uploaded by the user, Accurary

app.post('/input', (req, res) => {
    let data = { userInput: req.body.userInput };

    let sql = 'INSERT INTO inputs SET ?';
    let query = connection.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Input stored in database');
    });

    // FIND  ACCURARY


});



app.listen(3000, () => {
    console.log('Server started on port 3000');
});