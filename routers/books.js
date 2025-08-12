const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

// const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public/', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) =>{
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   }
// })

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
        console.error("Message:", err.message);
        console.error("Errors:", err.errors);
        res.redirect('/')
    }
});
// Route New Books
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());  
}); 
// Route Create Books

router.post('/', async (req, res) => {
    console.log(req.body.cover)
    // const filename = req.file != null ? req.file.filename : null; 
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        // coverImageName: filename,
        pageCount: req.body.pageCount
});
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`);
    } catch(err) {
        renderNewPage(res, book, true);
    }
})
async function renderNewPage(res, book, hashError = false) {
  renderFormPage(res, book, 'new', hashError);
}
// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err =>{
//         if(err) console.error(err);
//     }
// )}
// lưu bìa 
function saveCover(book, coverEncoded) {
    if (!coverEncoded) return;
    let cover;
    try {
        cover = JSON.parse(coverEncoded);
    } catch (err) {
        console.error("Invalid cover JSON:", coverEncoded);
        return;
    }
    if (cover && imageMimeTypes.includes(cover.type)) {
        book.coverImage = Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

// Show Book
router.get('/:id', async(req,res)=>{
    let book;
    try{
        book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', {
            book: book
        })
    }catch{
        console.error("Message show books:", err.message);
        console.error("Errors show books:", err.errors);
        res.redirect('/books');
    }
})

// Edit Book
router.get('/:id/edit', async(req,res)=>{
    try{
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);
    }catch(err){
        console.error("Message edit books:", err.message);
        console.error("Errors edit books:", err.errors);
    }
})
async function renderEditPage(res, book, hashError = false) {
    renderFormPage(res, book, 'edit', hashError);
}
async function renderFormPage(res, book, form, hashError = false) {
    try{
        const authors = await Author.find({});
        const params = {
            book: book,
            authors: authors
        }
        if(hashError){
          if(form === 'new') {
            params.errorMessage = 'Error creating Book';
          }
          else if(form === 'edit'){
            params.errorMessage = 'Error updating Book';
          } 
        }
        res.render(`books/${form}`, params)
    }catch(err){
        console.error("Message Edit Book:", err.message);
        console.error("Errors Edit Book:", err.errors);
        res.redirect('/books');
    }
}
// Update Book
router.put('/:id', async(req,res)=>{
    let book;
    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.description = req.body.description;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        saveCover(book, req.body.cover);
        await book.save();
        res.redirect(`/books`);
    }catch{
        
    }
})

// Delete Book
router.delete('/:id', async(req,res)=>{
    let book;
    try{
        book = await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    }catch(err){
        console.error("Message delete books:", err.message);
        console.error("Errors delete books:", err.errors);
    }
})
module.exports = router;