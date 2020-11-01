require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')

//database connection
require("./database")();

const app = express();

app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

//Template engine setup
app.set('view engine', 'pug')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/domain', require('./routes/domain.route'))

app.listen(process.env.PORT, () => console.log(`Server is started on ${process.env.DB_HOST}:${process.env.PORT} `))