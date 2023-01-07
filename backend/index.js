// constants
const PORT = process.env.port || 5000;
const DB_PATH = "data/db.json";
const CLIENT_REF = 'http://localhost:3000';


const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (request, response) => {
    fs.readFile(DB_PATH, (err, data) => {
        if (!err) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', CLIENT_REF);
            response.send(data);
        } else {
            response.statusCode = 404;
            response.send("Resourse not found!");
        }
    })
})

app.post('/', (request, response) => {
    fs.readFile(DB_PATH, (err, data) => {
        if (!err) {
            const changes = request.body;
            const objToChange = JSON.parse(data.toString());
            
            for (let letter of changes.letters) {
                objToChange[changes.alphabetType][letter.ind] = letter.content;
            }
            
            fs.writeFile(DB_PATH, JSON.stringify(objToChange), function(error) {
                if (error) console.log('ERROR: Cannot write data into data base');
                console.log('Data has been succesfully saved');
            })

            response.statusCode = 200;
            response.setHeader('Access-Control-Allow-Origin', CLIENT_REF);
            response.send('Success');
        } else {
            response.statusCode = 404;
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send("Resourse not found!");
        }
    })
})

app.listen(PORT, ()=>console.log("Сервер запущен..."));