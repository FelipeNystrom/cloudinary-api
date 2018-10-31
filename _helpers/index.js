const fs = require('fs');
const path = require('path');
const pathToTempDir = path.resolve(__dirname, '../', '_tmp-media-storage');

/*  helper function to clear temporary image storage on server */

const tempStorageTruncate = () => {
  return fs.readdir(pathToTempDir, (err, files) => {
    files.forEach(img => {
      fs.unlink(path.join(pathToTempDir, img), err => {
        if (err) throw err;
      });
    });
    if (err) throw err;
  });
};

/* Config for cors handling */

const whitelist = process.env.CLIENTS.split(',');
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = {
  tempStorageTruncate,
  corsOptions
};
