const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public/', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) =>{
    callback(null, imageMimeTypes.includes(file.mimetype));
  }

})
// Route All Books
router.get('/', async (req, res) => {
    
    try{
        let searchOptions = {};
        if(req.query.title != null && req.query.title!==''){
            searchOptions.title = new RegExp(req.query.title, 'i');
        }
        let filterDate = {}
        if(req.query.publishedAfter != null && req.query.publishedAfter !== ''){
            filterDate.$gte = new Date(req.query.publishedAfter);
        }
        if(req.query.publishedBefore != null && req.query.publishedBefore !== ''){
            filterDate.$lte = new Date(req.query.publishedBefore);
        }
        if(Object.keys(filterDate).length > 0) {
            searchOptions.publishDate = filterDate;
        }
        const books =  await Book.find(searchOptions)
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    }catch(err) 
    {
        console.error("Error fetching books:", err);
        res.redirect('/')
    }
});
// Route New Books
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());  
}); 
// Route Create Books

router.post('/', upload.single('cover'), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null; 
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        coverImageName: filename,
        pageCount: req.body.pageCount
});
    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('/books');
    } catch(err) {
       console.error("Message:", err.message);
        console.error("Errors:", err.errors);
        if(book.coverImageName != null) {
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
})
async function renderNewPage(res, book, hashError = false) {
    try{
        const authors = await Author.find({});
        
        const params = {
            book: book,
            authors: authors
        }
        if(hashError) params.errorMessage = 'Error creating Book';
        res.render('books/new', params)
    }catch{
        res.redirect('/books');
    }
}
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err);
    }
)}

module.exports = router;