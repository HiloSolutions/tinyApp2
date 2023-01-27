const bcrypt = require("bcryptjs");


// find user by their email, return the user object
const getUserByEmail = (userEmail, database) => {
  let userExists = undefined;
  const userList = Object.values(database);

  userList.forEach(user => {
    if (user.email === userEmail) {
      userExists = user;
      return userExists;
    }
  });

  return userExists;
};

//generate uid and shorturl
const generateID = () => {
  return Math.random().toString(36).substring(2, 8);
};

// check login status function (to help make code more readable since this is a common action)
const checkLoginStatus = (userIdCookie) => {
  if (userIdCookie) {
    return true;
  }
  return false;
};

// build database of urls relevant to specific user
const getUserURLs = (user, database) => {
  let userURLs = {};
  const urlList = Object.keys(database);

  urlList.forEach(url => {
    if (database[url].userID === user) {
      const longURL = database[url].longURL;
      userURLs[url] = longURL;
    }
  });
  return userURLs;
};

const compareHash = (password, hash) => {
  return bcrypt.compareSync(password, hash); // returns true
};

module.exports = {
  getUserByEmail,
  generateID,
  checkLoginStatus,
  getUserURLs,
  compareHash
};
