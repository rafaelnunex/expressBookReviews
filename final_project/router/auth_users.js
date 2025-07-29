const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const existUser = users.filter(user => user.username === username).length > 0;
    return !existUser;
}

const authenticatedUser = (username,password) => {
    const user = users.filter(user => user.username === username);

    if (user.length > 0) {
        return user[0].password === password;
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization["username"];
    const review = req.query.review;

    if (!review) {
        return res.status(404).json({ message: "You must provide an review. " });
    }
    
    if (!book) {
        return res.status(404).json({ message: "There is no book with the ISBN code: " + isbn });
    }

    book["reviews"][username] = review;

    return res.status(200).json({ message: "Your review has been submitted!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization["username"];
    
    if (!book) {
        return res.status(404).json({ message: "There is no book with the ISBN code: " + isbn });
    }

    if (book["reviews"][username]) {
        delete book["reviews"][username];
        return res.status(200).json({ message: "Your review has been removed!" });
    }
    
    return res.status(400).json({ message: "There is no review to remove!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
