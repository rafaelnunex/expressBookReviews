const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let bookDetails = books[isbn];

    if (bookDetails) {
        return res.status(200).send(JSON.stringify(bookDetails, null, 4));
    } else {
        return res.status(400).json({ message: "There is no book with the ISBN code: " + isbn });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksFiltered = []
    
    for (const book of Object.values(books)) {
        if (book["author"] === author) {
            booksFiltered.push(book)
        }
    }

    if (booksFiltered.length > 0 ) {
        return res.status(200).send(JSON.stringify(booksFiltered, null, 4));
    } else {
        return res.status(400).json({ message: "There is no book of the Author: " + author });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksFiltered = []
    
    for (const book of Object.values(books)) {
        if (book["title"] === title) {
            booksFiltered.push(book)
        }
    }

    if (booksFiltered.length > 0 ) {
        return res.status(200).send(JSON.stringify(booksFiltered, null, 4));
    } else {
        return res.status(400).json({ message: "There is no book of the Title: " + title });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let bookReview = books[isbn]["reviews"];

    if (bookReview) {
        return res.status(200).send(books[isbn]["title"] + " book reviews: \n\n" + JSON.stringify(bookReview, null, 4));
    } else {
        return res.status(400).json({ message: "There is no book with the ISBN code: " + isbn });
    }
});

module.exports.general = public_users;
