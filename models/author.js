const mongoose = require('mongoose');
const book = require('./book');
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }

})

authorSchema.pre('findOneAndDelete', async function(next) {
 try {
    const authorId = this.getQuery()._id; 
    const books = await Book.find({ author: authorId });
    if (books.length > 0) {
        return next(new Error('This author still has books.'));
    }
    else{
        next();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model('Author', authorSchema);