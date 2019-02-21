const express = require('express');
const server = express();
const mountRoutes = require('./_routes');
const port = process.env.PORT || 6000;

// server configs
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

mountRoutes(server);

server.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
