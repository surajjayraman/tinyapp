const express = require("express");
const bodyParser = require("body-parser");
const cookies = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
const findUserByEmail = (email) => {
  // iterate through the users object
  // looping through the keys with a for in
  for (let userId in users) {
    // try the match the email of each
    if (users[userId]['email'] === email) {
      // if it matches return truthy
      return users[userId];
    }
  }
  // if it never returned true, then return false by default
  return false;
};

// validation: check for user credentials
const authenticateUser = (email, password) => {
  // loop through the users db => object
  const user = findUserByEmail(email);
  // check that values of email and password if they match
  if (user && user.password === password) {
    // return user id if it matches
    return user.id;
  }
  
  // default return false
  return false;
  
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
app.use(cookies());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//trying to fetch variable from two separate routes.
//local scope fails
//Global works!
const a = 1;
app.get("/set", (req, res) => {
  res.send(`a = ${a}`);
});
   
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  // get the user id from the cookies
  const userId = req.cookies['user_id'];
  const templateVars = {urls: urlDatabase, user: users[userId]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // get the user id from the cookies
  const userId = req.cookies['user_id'];
  const templateVars = {user: users[userId]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // get the user id from the cookies
  const userId = req.cookies['user_id'];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[userId] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// The GET method route for User Registration
// Display the register form
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_registration", templateVars);
});

// Display the Login form
app.get("/login", (req, res) => {
  const templateVars = {user : null};
  res.render("urls_login", templateVars);
});


app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// POST route that removes a URL resource
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

// a POST route that updates a URL resource
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newURL;
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
  const userId = authenticateUser(email, password);

  if (userId) {
    // Set the cookie with the user id
    res.cookie('user_id', userId);
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
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Handle Registration
app.post("/register", (req, res) => {
  // Extract the user info from the form
  console.log("user info:", req.body);
  const email = req.body.email;
  const password = req.body.password;
  // Check for empty email | password
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send('Either email or password is empty!');
  }
  // validation: check that the user is not already in the database
  const user = findUserByEmail(email);

  // if user is not previously registered, we can add the user in the db
  if (!user) {
    // generate a new user id
    const userId = generateRandomString();
    // create a new user object
    const newUser = {
      id: userId,
      email,
      password
    };
    // Adding user info to usersDb
    users[userId] = newUser;
    // set the cookie => to remember the user (to log the user in)
    // ask the browser to set a cookie
    res.cookie('user_id', userId);
    console.log("New User Info: ", newUser);
    res.redirect("/urls");
    
  } else {
    return res.status(403).send('User is already registered!');
  }
});

//listen on port specified for incoming user requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});