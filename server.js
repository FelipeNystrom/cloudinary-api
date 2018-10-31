const express = require('express');
const server = express();
const port = process.env.PORT || 7500;

server.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
