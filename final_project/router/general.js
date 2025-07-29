const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let searchPromisse = new Promise((resolve, reject) => {
        res.status(200).send(JSON.stringify(books, null, 4));
        resolve("Finish with success!");
    });

    searchPromisse
        .then((successMessage) => {
            console.log(successMessage);
        })
        .catch((error) => {
            console.error("Error: " + error.message);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let searchPromisse = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        let bookDetails = books[isbn];

        if (bookDetails) {
            res.status(200).send(JSON.stringify(bookDetails, null, 4));
            resolve("Finish with success!");
        } else {
            const errorMessage = "There is no book with the ISBN code: " + isbn
            res.status(400).json({ message: errorMessage });
            reject(new Error(errorMessage));
        }
    });

    searchPromisse
        .then((successMessage) => {
            console.log(successMessage);
        })
        .catch((error) => {
            console.error("Error: " + error.message);
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    let searchPromisse = new Promise((resolve, reject) => {
        const author = req.params.author;
        let booksFiltered = []
        
        for (const book of Object.values(books)) {
            if (book["author"] === author) {
                booksFiltered.push(book)
            }
        }
    
        if (booksFiltered.length > 0 ) {
            res.status(200).send(JSON.stringify(booksFiltered, null, 4));
            resolve("Finish with success!");
        } else {
            const errorMessage = "There is no book of the Author: " + author
            res.status(400).json({ message: errorMessage });
            reject(new Error(errorMessage));
        }
    });

    searchPromisse
        .then((successMessage) => {
            console.log(successMessage);
        })
        .catch((error) => {
            console.error("Error: " + error.message);
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    let searchPromisse = new Promise((resolve, reject) => {
        const title = req.params.title;
        let booksFiltered = []
        
        for (const book of Object.values(books)) {
            if (book["title"] === title) {
                booksFiltered.push(book)
            }
        }
    
        if (booksFiltered.length > 0 ) {
            res.status(200).send(JSON.stringify(booksFiltered, null, 4));
            resolve("Finish with success!");
        } else {
            const errorMessage = "There is no book of the Title: " + title
            res.status(400).json({ message: errorMessage });
            reject(new Error(errorMessage));
        }
    });

    searchPromisse
        .then((successMessage) => {
            console.log(successMessage);
        })
        .catch((error) => {
            console.error("Error: " + error.message);
        });
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
