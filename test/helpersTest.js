const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = testUsers["userRandomID"];
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it('should return undefined when no user exists for a given email address', function() {
    const user = getUserByEmail("useruser@example.com", testUsers);
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
});