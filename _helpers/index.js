const fs = require('fs');
const path = require('path');
const { uploadImg } = require('../_image-and-video-storage');
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
let whitelist;

process.env.CLIENTS !== undefined
  ? (whitelist = process.env.CLIENTS.split(','))
  : (whitelist = []);

console.log(`Requests can be made from whitelisted clients: ${whitelist}`);

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

uploadOrUpdateImg = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      Error_message:
        'No file is sent in request! You have to send a image appended to a form to this route.'
    });
  }

  const {
    body: { folderName, description = null },
    file: { path, originalname },
    method
  } = req;

  //  Check if file is included in request
  if (!path) {
    return res.status(400).send({
      Error_message:
        'No image found in request! You have to send a image appended to a form to this route.'
    });
  }

  //   Send back error when image is not sent right
  if (!folderName) {
    return res.status(400).send({
      Error_message:
        'Missing destination folder in form, matching key "folderName"'
    });
  }
  // Check description type to be of type string
  if (description !== null && typeof description !== 'string') {
    return res.status(400).send({
      Error_message: 'image description must be of type string'
    });
  }

  try {
    /*
    Extract img form req object through req.file path and send to 
    Cloudinary upload function. Second parameter is foldername on Cloudinary 
    */

    const cloudinaryResult = await uploadImg(path, folderName);

    /* 
    Result form upload is an object where public id and https link is saved and sent back in response
    */

    const { public_id, secure_url } = cloudinaryResult;

    let action;

    if (method === 'PUT') {
      action = 'updated old image with ';
    }

    if (method === 'POST') {
      action = 'saved';
    }

    res.send({
      message: `Succefully ${action} image: "${originalname}" on cloudinary in folder ${folderName}`,
      'img-link': secure_url,
      'public-id': public_id
    });
  } catch (err) {
    /* If error send error response with catched error as feedback */
    console.error(`Error: ${err}`);
    res.status(500).send({ Error_message: `A error was catched: ${err}` });
  }

  tempStorageTruncate();
};

module.exports = {
  tempStorageTruncate,
  corsOptions,
  uploadOrUpdateImg
};
