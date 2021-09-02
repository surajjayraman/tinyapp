
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

module.exports = {
  getUserByEmail
};