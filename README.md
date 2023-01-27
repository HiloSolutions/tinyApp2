# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Create URL"](https://github.com/HiloSolutions/tinyApp2/blob/main/images/createurl.png?raw=true)
!["EditUrl"](https://github.com/HiloSolutions/tinyApp2/blob/main/images/editurl.png)
!["login"](https://github.com/HiloSolutions/tinyApp2/blob/main/images/login.png?raw=true)
!["database"](https://github.com/HiloSolutions/tinyApp2/blob/main/images/storeurl.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How To Use TinyApp
#### Register/Login
You must be logged in to create, view and edit links with this app. That said, anyone can use your shortened url if you share it with them (see the last point)!

Simply 'Register' or 'Login' with your email and password, and you're all set.

#### Create New Links
Simply paste the url you want to shorten in the 'Create New URL' tab on navigation bar.

That's it!

#### Edit or Delete Short Links
In 'My URLs', you can delete or edit any link that you want.

Only you can see and edit your database!

#### Use Your Short Link
The path to use any short link is /u/:shortLink. This will redirect you to the destination of your long url. Sharing in this way is perfect on applications like Twitter where ever character matters in your post.
