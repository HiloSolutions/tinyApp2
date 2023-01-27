const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");
const PORT = 8080;


// MIDDLEWARE
app.use(express.urlencoded({ extended: true })); //body parser
app.use(cookieSession({
  name: 'session',
  keys: ['hi'],
}));


// VARIABLES
const urlDatabase = {
  u2short: {
    longURL: "https://www.tsn.ca",
    userID: "2",
  },
  u1short: {
    longURL: "https://www.google.ca",
    userID: "1",
  },
};

const users = {
  1: {
    id: "1",
    email: "1@1",
    hashedPassword: "1",
  },
  2: {
    id: "2",
    email: "2@2",
    hashedPassword: "2",
  },
};


//FUNCTIONS
const { compareHash, getUserByEmail, generateID, checkLoginStatus, getUserURLs } = require("./helper");


// ROUTES

// // ADD/CREATE URL
// if the user is logged in, render 'create url' page
app.get("/urls/new", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  const id = req.session.userId;

  if (!loggedIn) res.redirect("/login");
  if (!id) res.redirect("/login");

  const templateVars = { user: users[id] };
  res.render("urls_new", templateVars);
});

// GET SHORT URL PAGE
//if url belongs to user in database, allow access to and render short url page
app.get("/urls/:id", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  const userURLs = getUserURLs(req.session.userId, urlDatabase);

  if (!loggedIn) return res.status(401).send('Access Denied.');
  if (!userURLs[req.params.id]) return res.status(401).send('Access Denied.');
  if (!urlDatabase[req.params.id]) return res.status(404).send('URL does not exist.');

  const userId = req.session.userId;
  const templateVars = {
    user: userId,
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL
  };

  res.render("urls_show", templateVars);
});

// REDIRECT
// to actual url destination
app.get("/u/:id", (req, res) => {
  const shortURL = urlDatabase[req.params.id];
  if (!shortURL) {
    res.status(404).send('URL does not exist.');
  } else {
    res.redirect(shortURL.longURL);
  }
});

// render 'my Urls page' with links specific to the user who is logged in.
app.get("/urls", (req, res) => {
  const userID = req.session.userId;
  const loggedIn = checkLoginStatus(userID);
  if (!loggedIn) return res.status(401).send('Access Denied. You must login to view the url database.');

  const userURLs = getUserURLs(userID, urlDatabase);
  const templateVars = {
    urls: userURLs,
    user: users[userID]
  };

  res.render("urls_index", templateVars);
});

//adds new url to database, redirects user to short url page
app.post("/urls", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  if (!loggedIn) return res.status(401).send('Access Denied. You must login to shorten urls.');

  const shortURL = generateID();

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userId,
  };

  res.redirect(`/urls/${shortURL}`);
});

// DELETE URL
// url deleted from database
app.post("/urls/:id/delete/", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  if (!loggedIn) return res.status(401).send('Access Denied. You must login to delete urls.');

  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// EDIT URL
// render SHORT URL page if the url belongs to them
app.post("/urls/:id/edit/", (req, res) => {
  const userId = req.session.userId;

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[userId]
  };
  res.render("urls_show", templateVars);

});

// RECEIVE SHORTURL SUBMISSION
// add url to MyUrls page, redirect to MyUrls age
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userId,
  };

  res.redirect('/urls');
});
// // ROOT
// re-route to login page.
app.get("/", (req, res) => {
  res.redirect("/login");
});

// //LOGIN
// get and render the login template
app.get("/login", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  if (loggedIn) res.redirect("/urls");

  const user = null;
  const templateVars = { user };
  res.render("urls_login", templateVars);
});

// user presses 'login' and is rerouted to 'My Urls' page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  if (!email || !password) return res.status(400).send('Please provide a username and a password.');
  if (!user) return res.status(400).send('Please register this email.');

  const hashedPass = user.hashedPassword;
  if (!compareHash(password, hashedPass)) return res.status(401).send('Incorrect Password.');

  console.log(user, " is logged in successfully");
  req.session.userId = user.id;
  res.redirect("/urls");
});

// //LOGOUT
// user clicks logout button, redirect to login page and cookies cleared
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect("/login");
});


// // REGISTER USER
// get and render the urls_registration template
app.get("/register", (req, res) => {
  const loggedIn = checkLoginStatus(req.session.userId);
  if (loggedIn) return res.redirect("/urls");

  const templateVars = { user: null };

  res.render("urls_register", templateVars);
});

// user presses 'register button', they are redirected to 'MyUrls' page
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) return res.status(400).send('Please provide a username and a password.');
  if (getUserByEmail(email, users)) return res.status(400).send('A user with this email already exists.');

  const id = generateID(); //can install uuid if needed
  const newUser = { id, email, hashedPassword };

  users[id] = newUser;
  req.session.userId = id;
  res.redirect("/urls");
});





//
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//instructions for what to do when server starts up
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
