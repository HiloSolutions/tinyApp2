const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

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
    const actual = user.id;
    const expected = "userRandomID";
    assert.equal(actual, expected);
  });
  it('should return a undefined with invalid email', function() {
    const user = getUserByEmail("invalidemail@hotmail.com", testUsers);
    const actual = user;
    const expected = undefined;
    assert.equal(actual, expected);
  });
});