const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  // Update the code here
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: 'User successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: 'Unable to register user.' });
});

const booksPromisified = async () => books;

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const books = await booksPromisified();
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const books = await booksPromisified();
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const { author: reqAuthor } = req.params;
  const books = await booksPromisified();
  const booksArray = Object.values(books).filter(
    ({ author }) => author === reqAuthor
  );
  return res.status(200).send(JSON.stringify(booksArray));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title: reqTitle } = req.params;
  const books = await booksPromisified();
  const booksArray = Object.values(books).filter(
    ({ title }) => title === reqTitle
  );
  return res.status(200).send(JSON.stringify(booksArray));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  return res.status(200).send(JSON.stringify(books[isbn]['reviews']));
});

module.exports.general = public_users;
