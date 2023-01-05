const PORT = process.env.port || 5000;

const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
    if (request.url === '/' && request.method === 'GET') {
        fs.readFile("data/db.json", function(err, data) {
            if (!err) {
                response.setHeader('Content-Type', 'application/json');
                response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                response.end(data);
            } else {
                response.statusCode = 404;
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.end("Resourse not found!");
            }
        })
    } else {
        response.statusCode = 500;
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end("An error was accured");
    }
})

server.listen(PORT, () => {
    console.log('Server has been started...');
})