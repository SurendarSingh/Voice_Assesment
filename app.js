const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const gTTS = require('gtts');
const stringSimilarity = require("string-similarity");
const { randomBytes } = require('crypto');
const fs = require('fs');

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
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

// Table: admin_task_1
// text_id, admin_name, text

app.get('/admin', (req, res) => {
    res.render("admin");
});

app.post('/admin', (req, res) => {
    let text = req.body.text;
    let text_id = randomBytes(10).toString('hex');
    
    var gtts = new gTTS(text, 'en');
    gtts.save(`${__dirname}/public/Task_2_AudioFiles/${text_id}.mp3`, function (err, result){
        if(err) { throw new Error(err); }
        console.log(`${text_id} audio file created`);
    });

    // text, text_id will be stored in admin_task_1
    var sql = `INSERT INTO admin_task_1 (text, text_id) VALUES ("${text}", "${text_id}")`;
    db.query(sql, function (err, result) {
        if (err) throw err;
    });

    res.send('Data inserted successfully');

});

// Table: user_task_1
// text_id, user_name, user_text, accuracy

app.get('/user', (req, res) => {

    var audioPath = "Task_2_AudioFiles/";
    var files = fs.readdirSync(audioPath);
    let chosenFile = audioPath + files[Math.floor(Math.random() * files.length)];
    
    res.render("user", {audioFile: chosenFile});
});

app.post('/user', (req, res) => {
    let data = { 
        userName: req.body.userName,
        userText: req.body.userText,
        text_id: req.body.text_id
    };


    // Code to retrieve text through text_id from admin_task_1 Database
    var text = "";
    console.log("done");


    var accuracy = 100;
    res.send('Your Accuracy is ' + accuracy + "%");

    Math.round(stringSimilarity.compareTwoStrings(userText, text) * 100);

    // text_id, user_name, user_text, accuracy store in user_task_1
    // let sql = 'INSERT INTO inputs SET ?';
    // let query = connection.query(sql, data, (err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    //     res.send('Your Accuracy is ' + accuracy + "%");
    // });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});