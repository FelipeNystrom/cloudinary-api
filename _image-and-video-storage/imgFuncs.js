const cloudinary = require('cloudinary');
const configObj = require('./config');

cloudinary.config(configObj);

module.exports = {
  uploadImg: (imgPath, toFolder) => {
    return cloudinary.v2.uploader.upload(
      imgPath,
      { folder: toFolder, use_filename: true, phash: true },
      (error, result) => (result, error)
    );
  },
  deleteImg: publicId => {
    return cloudinary.v2.uploader.destroy(
      publicId,
      (error, result) => (result, error)
    );
  }
};
