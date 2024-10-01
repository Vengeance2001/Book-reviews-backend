const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some(({ username: uname }) => uname === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    ({ username: uname, password: pword }) =>
      uname === username && pword === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        username,
      },
      'access',
      { expiresIn: 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const {
    params: { isbn },
    query: { review },
    user: { username },
  } = req;
  console.log(username, review);
  const book = books[isbn];
  if (!book)
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });

  let message = null;
  let status = 200;
  if (book.reviews[username]) {
    message = 'Book review updated.';
  } else {
    message = 'Book review added.';
    status = 201;
  }
  book.reviews[username] = review;

  return res.status(status).json({ message });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const {
    params: { isbn },
    user: { username },
  } = req;
  const book = books[isbn];
  if (!book)
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });

  let message = null;
  let status = 200;
  console.log(books);
  if (book.reviews[username]) {
    message = 'Book review deleted.';
    delete book.reviews[username];
  } else {
    message = 'Book review not found.';
    status = 404;
  }

  return res.status(status).json({ message });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
