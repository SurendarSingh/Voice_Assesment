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
    database: 'voice_assessment'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to mysql database');
});



app.get('/admintask1', (req, res) => {
    res.render("admin_task1");
});

app.post('/admintask1', (req, res) => {
    const text = req.body.text;

    const sql = `INSERT INTO admin_task_1 (text) VALUES ("${text}")`;
    db.query(sql, function (err, result) {
        if (err) throw err;
    });
    res.send('Data inserted successfully in admin_task_1');
});



app.get('/admintask2', (req, res) => {
    res.render("admin_task2");
});

app.post('/admintask2', (req, res) => {
    const text = req.body.text;
    const text_id = randomBytes(10).toString('hex');
    
    const gtts = new gTTS(text, 'en');
    gtts.save(`${__dirname}/public/Task_2_AudioFiles/${text_id}.mp3`, function (err, result){
        if(err) { throw new Error(err); }
        console.log(`${text_id} audio file created for task 2`);
    });

    const sql = `INSERT INTO admin_task_2 (text, text_id) VALUES ("${text}", "${text_id}")`;
    db.query(sql, function (err, result) {
        if (err) throw err;
    });

    res.send('Data inserted successfully in admin_task_2');
});



app.get('/usertask1', (req, res) => {
    const sql = `SELECT text FROM admin_task_1 ORDER BY RAND() LIMIT 1`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render("user_task1", {Text: result[0].text});
    });
});

app.post('/usertask1', (req, res) => {
    const user_name = req.body.userName;
    const user_text = req.body.userText;
    const text = req.body.text;
    
    const accuracy = Math.round(stringSimilarity.compareTwoStrings(text.toLowerCase(), user_text.toLowerCase()) * 100);
    const sql = `INSERT INTO user_task_1 (user_name, user_text, text, accuracy) VALUES ("${user_name}", "${user_text}", "${text}", "${accuracy}")`;
    db.query(sql, function (err, result) {
        if (err) throw err;
    });

    res.send({user_name, user_text, text, accuracy});
});



app.get('/usertask2', (req, res) => {

    const audioPath = __dirname + "/public/Task_2_AudioFiles/";
    const files = fs.readdirSync(audioPath);
    const chosenFile = files[Math.floor(Math.random() * files.length)];

    res.render("user_task2", {audioFile: chosenFile});
});

app.post('/usertask2', (req, res) => {
    const user_name = req.body.userName;
    const user_text = req.body.userText;
    const text_id = req.body.text_id.split(".")[0];

    db.query(`SELECT text FROM admin_task_2 WHERE text_id="${text_id}"`, function (err, result, fields) {
        if (err) throw err;

        const admin_text = result[0].text;
        const accuracy = Math.round(stringSimilarity.compareTwoStrings(admin_text.toLowerCase(), user_text.toLowerCase()) * 100);

        const sql = `INSERT INTO user_task_2 (user_name, user_text, text_id, accuracy) VALUES ("${user_name}", "${user_text}", "${text_id}", "${accuracy}")`;
        db.query(sql, function (err, result) {
            if (err) throw err;
        });

        res.send({user_name, user_text, text_id, admin_text, accuracy});
    });
    
});



app.listen(3000, () => {
    console.log('Server started on port 3000');
});