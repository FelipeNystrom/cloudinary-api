const handleImages = require('./handleImages');

module.exports = server => {
  server.use('/api/upload', handleImages);
};
