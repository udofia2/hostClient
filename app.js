require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");


require("./database")();

const app = express();

app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

app.set('view engine', 'pug')
app.set('views', 'views')
app.use('/api/domain', require('./routes/domain.route'))

app.listen(process.env.PORT, () => console.log(`Server is started on ${process.env.DB_HOST}:${process.env.PORT} `))