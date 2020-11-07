const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors';)

const morgan = require('morgan');//middleware
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config()
// const myOwnMiddleware = (req, res, next) => {
//     console.log("middleware applied!");
//     next();/**si no escribimos esta linea de codigo,
//     el middleware se queda en un loop infinito */
// };
// app.use(myOwnMiddleware);

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true},{ useUnifiedTopology: true })
    .then(() => console.log('DB Connected'));//promise based library

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

app.use(morgan("dev"));/*you see what's happening 
what road to getting the request from
morgan dev muestra los request
*/
//api docs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if(err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);    
    });
    
});

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);/**se puede dejar siempre la direccion root '/'
siempre y cuando se maneje de manera apropiada el routing en la carpeta
y archivos route */
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Unauthorized!'})
    }
});





// app.use(express.json());
// app.use(express.urlencoded);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A node js API is listening on port: ${port}`);
});