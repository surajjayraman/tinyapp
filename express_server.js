const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  //"b2xVn2": "http://www.lighthouselabs.ca",
  //"9sm5xK": "http://www.google.com"

  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

// object users will be used to store and access the users in the app
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// validation: check that the user is not already in the database
const getUserByEmail = function(email, database) {
  // iterate through the users object
  // looping through the keys with a for in
  for (const userId in database) {
    // try the match the email of each
    if (database[userId]['email'] === email) {
      // if it matches return truthy
      return database[userId];
    }
  }
  // if it never returned true, then return false by default
  return false;
};

// validation: check for user credentials
const authenticateUser = (email, password, database) => {
  // loop through the users db => object
  const user = getUserByEmail(email, database);
  // check that values of email and password if they match
  if (user && bcrypt.compareSync(password, user.password)) {
    // return user id if it matches
    return user.id;
  }
  
  // default return false
  return false;
  
};

// Helper function which returns the URLs
// where the userID is equal to the id of
// the currently logged-in user.
const urlsForUser = (id, urlDB) => {
  const userUrls = {};
  for (const shortURL in urlDB) {
    if (urlDB[shortURL]['userID'] === id) {
      userUrls[shortURL] = urlDB[shortURL];
    }
  }
  return userUrls;
};

/* Generates a random string, used for creating short URLs and userIDs */
const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['CHIHUAHAHAH'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

/* ROUTES Implementation */
app.get("/", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  //if user not logged in => redirect to login page
  if (!userId) {
    return res.redirect("/login");
  }
  return res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  //if user not logged in => redirect to login page
  if (!userId) {
    return res.redirect("/login");
  }
  // filter urlDatabase for user related urls
  const userURLS = urlsForUser(userId, urlDatabase);
  const templateVars = {urls: userURLS, user: users[userId]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  // if user not logged in redirect to login page
  if (!userId) {
    return res.redirect("/login");
  }
  const templateVars = {user: users[userId]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("The short URL you are trying to access does not correspond with a long URL.");
  }
  const templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],
    user: users[userId] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  if (longURL.length === 0) {
    return res.status(404).send("The short URL you are trying to access does not correspond with a long URL.");
  }
  return res.redirect(longURL);
});

// The GET method route for User Registration
// Display the register form
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_registration", templateVars);
});

// Display the Login form
app.get("/login", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  if (!userId) {
    const templateVars = {user : null};
    return res.render("urls_login", templateVars);
  }
  return res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  
  // get the user id from the cookies
  const userId = req.session.userId;
  // if user not logged in redirect to login page
  if (!userId) {
    return res.status(401).send("You must be logged in to a valid account to create short URLs.");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userId
  };
  res.redirect(`/urls/${shortURL}`);

  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// POST route that removes a URL resource
app.post("/urls/:shortURL/delete", (req, res) => {
  // get the user id from the cookies
  const userId = req.session.userId;
  // if user not logged in redirect to login page
  if (!userId) {
    return res.status(401).send("You must be logged in to a valid account to delete short URLs.");
  }
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

// a POST route that updates a URL resource
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // get the user id from the cookies
  const userId = req.session.userId;
  // if user not logged in display error msg
  if (!userId) {
    return res.status(401).send("You must be logged in to a valid account to create short URLs.");
  }
  urlDatabase[shortURL]['longURL'] = req.body.newURL;
  res.redirect("/urls");
});

// Authenticate the user
// Authentication
// The Login Route
app.post("/login", (req, res) => {
  // extract the information from the form with req.body
  // email + password
  const email = req.body.email;
  const password = req.body.password;
  // user must exist, check for the password
  // either userId has a value or it is falsy
  const userId = authenticateUser(email, password, users);

  if (userId) {
    // Set the cookie with the user id
    req.session.userId = userId;
    // redirect to /urls
    res.redirect('/urls');
  } else {
    // user is not authenticated => error message
    res.status(403).send('Wrong credentials');
  }
});

// The Logout Route
// Handle logout by clearing the cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Handle Registration
app.post("/register", (req, res) => {
  // Extract the user info from the form
  const email = req.body.email;
  const password = req.body.password;
  // Check for empty email | password
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send('Either email or password is empty!');
  }
  // validation: check that the user is not already in the database
  const user = getUserByEmail(email, users);

  // if user is not previously registered, we can add the user in the db
  if (!user) {
    // generate a new user id
    const userId = generateRandomString();
    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // create a new user object
    const newUser = {
      id: userId,
      email,
      password: hashedPassword
    };
    // Adding user info to usersDb
    users[userId] = newUser;
    // set the cookie => to remember the user (to log the user in)
    // ask the browser to set a cookie
    req.session.userId = userId;
    res.redirect("/urls");
    
  } else {
    return res.status(403).send('User is already registered!');
  }
});

//listen on port specified for incoming user requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});