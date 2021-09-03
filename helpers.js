const bcrypt = require('bcrypt');
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

module.exports = {
  getUserByEmail,
  authenticateUser,
  urlsForUser,
  generateRandomString
};