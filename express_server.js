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
  //console.log(req.cookies["username"]);
  // get the user id from the cookies
  const userId = req.cookies['user_id'];
  //const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  const templateVars = {urls: urlDatabase, user: users[userId]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // get the user id from the cookies
  const userId = req.cookies['user_id'];
  //const templateVars = {username: req.cookies["username"]};
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
  const templateVars = {user: null}
  res.render("urls_registration", templateVars);
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

// The Login Route
app.post("/login", (req, res) => {
  const cookie = req.body.username;
  res.cookie('username', cookie);
  res.redirect("/urls");
});

// The Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// Handle Registration
app.post("/register", (req, res) => {
  // Extract the user info from the form
  console.log("user info:", req.body);
  const email = req.body.email;
  const password = req.body.password;
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
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});