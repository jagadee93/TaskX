require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const corsOptions = require('./config/corsOptions');
const port = process.env.PORT || 5000;
const connectDB = require('./config/dbConn');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require("./middleware/verifyJwt");
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');


connectDB();


//custom middleware logger 
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);


// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

app.use("/api/v1", require('./routes/authentication'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);
//routes that  require authentication 
app.use("/api/v1", require('./routes/api/v1/tasks'));








app.all('*', (req, res) => {
    console.log("request error")
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("connected DB")
    app.listen(port, () => {
        console.log(`server listening at http://localhost:${port}`)
    });
});
