const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const gTTS = require('gtts');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'voice_assessment'
// });

// db.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to mysql database');
// });

// Table 1 __ POST /admin
// Primary Key, Admin Name, Text, UUID

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.post('/admin', (req, res) => {
    let data = {
        name: req.body.name,
        text: req.body.text,
        text_id: randomBytes(10).toString('hex')
    };
    var gtts = new gTTS(text, 'en');
    
    gtts.save(`${text_id}.mp3`, function (err, result){
        if(err) { throw new Error(err); }
        console.log(`${text_id} audio file created`);
    });

    let sql = 'INSERT INTO users SET ?';
    let query = connection.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Data inserted successfully');
    });

});

// Table 2 __ POST /input
// Primary Key, User Name, Text uploaded by the user, uuid, Accurary

app.get('/user', (req, res) => {
    res.sendFile(__dirname + "/user.html");
});

app.post('/user', (req, res) => {
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