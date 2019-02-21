const express = require('express');
const server = express();
const mountRoutes = require('./_routes');
const { corsOptions } = require('./_helpers');
const cors = require('cors');
const port = process.env.PORT || 6000;

// server configs
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors({ corsOptions }));
// Enables pre-flight request to put, del, option requests
server.options('*', cors());

mountRoutes(server);

server.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
