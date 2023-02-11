const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const gTTS = require('gtts');
const stringSimilarity = require("string-similarity");
const { randomBytes } = require('crypto');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'xyz'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to mysql database');
});

// Table: admin_task_1
// text_id, admin_name, text

app.get('/admin', (req, res) => {


    res.sendFile(__dirname + "/admin.html");
});

app.post('/admin', (req, res) => {
    let data = {
        name: req.body.name,
        text: req.body.text,
        text_id: randomBytes(10).toString('hex')
    };
    
    var gtts = new gTTS('Hi bro how are you', 'en');
    gtts.save(`${__dirname}/Task_2_AudioFiles/${text_id}.mp3`, function (err, result){
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

// Table: user_task_1
// text_id, user_name, user_text, accuracy

app.get('/user', (req, res) => {

    // Radomly select one audio file from Task_2_AudioFiles Folder

    res.sendFile(__dirname + "/user.html");
});

app.post('/user', (req, res) => {
    let data = { userInput: req.body.userInput };

    var accuracy = stringSimilarity.compareTwoStrings("healed", "sealed") * 100;

    let sql = 'INSERT INTO inputs SET ?';
    let query = connection.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Input stored in database');
    });
});

console.log(Math.round(stringSimilarity.compareTwoStrings("I went to john house to buy bread", "to buy bread I went john house") * 100));

app.listen(3000, () => {
    console.log('Server started on port 3000');
});