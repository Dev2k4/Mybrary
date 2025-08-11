if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const book = require('./models/book');
const expresslayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const overrride = require('method-override');
// Import routers
const indexRouter = require('./routers/index');
const authorRouter = require('./routers/authors');
const bookRouter = require('./routers/books');

// set up view and layout
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expresslayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(overrride('_method'));

const mongoose = require('mongoose');
const { callback } = require('chart.js/helpers');
mongoose.connect(process.env.MONGO_URI)

// connect MongoDB
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Use routers
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on', process.env.PORT);


});

