const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

// Test data set up for getUserByEmail
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

// Test data set up for urlsForUser
const testUrlDatabase = {
  "bfjqot": {
    longUrl: "http://www.lighthouselabs.ca",
    userID: "user1RandomID"
  },
  "htlams": {
    longUrl: "http://www.google.com",
    userID: "user1RandomID"
  },
  "mjqcht": {
    longUrl: "http://www.zara.com",
    userID: "user2RandomID"
  }
};
  
// Test scenarios for getUserByEmail
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    // Write your assert statement here
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined when no user exists for a given email address', function() {
    const user = getUserByEmail("useruser@example.com", testUsers);
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
});

// Test scenarios for generateRandomString
describe('generateRandomString', function() {

  it('should return a string with six characters', function() {
    const randomStringLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(randomStringLength, expectedOutput);
  });
  
  it('should not return the same string when called multiple times', function() {
    const firstRandomString = generateRandomString();
    const secondRandomString = generateRandomString();
    assert.notEqual(firstRandomString, secondRandomString);
  });
});

// Test scenarios for urlsForUser
describe('urlsForUser', function() {

  it('should return an object of url information specific to the given user ID', function() {
    const specificUrls = urlsForUser("user1RandomID", testUrlDatabase);
    const expectedOutput = {
      "bfjqot": {
        longUrl: "http://www.lighthouselabs.ca",
        userID: "user1RandomID"
      },
      "htlams": {
        longUrl: "http://www.google.com",
        userID: "user1RandomID"
      }
    };
    assert.deepEqual(specificUrls, expectedOutput);
  });
  
  it('should return an empty object if no urls exist for a given user ID', function() {
    const noSpecificUrls = urlsForUser("fakeUser", testUrlDatabase);
    const expectedOutput = {};
    assert.deepEqual(noSpecificUrls, expectedOutput);
  });
});
  