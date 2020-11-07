const helpers = require('./helpers');
const http = require('http');

// const total = helpers.sumaa(5,6);
// console.log(total);

//creating a server with http module
// const server = http.createServer((req, res) => {
//     res.end("hello world 1 2 3 from node js");
// });
// server.listen(3000);


// //creating a server with express module
const express = require('express');
const app = express();

// //listen requests coming from the browser (home page '/') to the server
// app.get('/', (req, res) => {
//     res.send("hey jude, dont make it bad")
// });
app.listen(3000);

//file system module
const fs = require('fs');
const fileName = "target.txt";
//watch vigila si un archivo ha cambiado
// fs.watch(fileName, () => {
//     console.log(`File changed!`)
// });

// app.get('/', (req, res) => {
//     fs.readFile(fileName, (err,data) => {
//         if(err) {
//             res.send(err);
//         }
//         res.send(data.toString());
//     })
// });

//synchronous programming
// const data = fs.readFileSync(fileName);
// console.log(data.toString());

const errHandler = err => console.log(err);
const dataHandler = data => console.log(data.toString());


//asynchronous programming
fs.readFile(fileName, (err, data) => {
    if(err) errHandler(err);
    dataHandler(data);//toString method converts from buffer to text
})


console.log('async programming in node js');




