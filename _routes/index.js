const handleImages = require('./handleImages');

module.exports = server => {
  server.use('/image', handleImages);
};
