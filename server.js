const express = require('express');
const userRouter = require("./users/userRouter");

const server = express();

server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);
// server.use("/api/posts", postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const requestTime = new Date();
  console.log(`${req.method}, ${req.url}, ${requestTime}`);
  next();
};

module.exports = server;
