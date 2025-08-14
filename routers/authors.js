const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

const { redirect } = require('react-router-dom');
// Route Authors
router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query
        });

    }
    catch (err) {
    res.redirect('/', {
        errorMessage: 'Error fetching Authors'
    });
    }
});

// New Author
router.get('/new', async (req, res) => {
  res.render('authors/new', {author: new Author()});
});
// Create Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save();
        // res,redirect(`/authors/${newAuthor.id}`);
        res.redirect('authors');
    }
    catch (err) {
        console.log(err);
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })}
})

// Show Author
router.get('/:id', async (req, res) => {
    let author;
    let books;
    try {
    author = await Author.findById(req.params.id);
    books = await Book.find({ author: author.id });
    res.render('authors/show', {
        author: author,
        books: books
    });
    }catch (err) {
        console.error("Message:", err.message);
        console.error("Errors:", err.errors);
        return res.redirect('/authors');
    }
    

    })

// Edit Author
router.get('/:id/edit', async (req, res) => {
    res.render('authors/edit',{ author: await Author.findById(req.params.id)})
    
})

// Update Author
router.put('/:id', async (req,res) =>{
    let author
    try{
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
    }catch(err) {
    if(author == null) {
        return res.redirect('/');
    }else {
        res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
        })
    }}
    
})
router.delete('/:id', async (req,res) =>{
    let author
    try{
        author = await Author.findOneAndDelete({_id: req.params.id});
        res.redirect('/authors');
    }catch(err) {
    console.error("Message:", err.message);
    console.error("Errors:", err.errors);
    }
})
module.exports = router;