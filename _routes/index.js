const handleUploads = require('./handleUploads');

module.exports = server => {
  server.use('/api/upload', handleUploads);
};
