if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const expresslayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routers/index');
const authorRouter = require('./routers/authors');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expresslayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
  console.log("MONGO_URI =", process.env.MONGO_URI);

});

