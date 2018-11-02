const redis = require('redis');
const Router = require('express-promise-router');
const router = new Router();
const { promisify } = require('util');
const { handleFormData, uploadImg } = require('../_image-and-video-storage');
const { tempStorageTruncate } = require('../_helpers');

const client = redis.createClient();

client.on('error', err => {
  console.log('Error ' + err);
});

module.exports = router;

router.post('/image', handleFormData.single('img'), async (req, res) => {
  const { folderName, description = null } = req.body;

  //   Send back error when image is not sent right
  if (!folderName) {
    return res.status(500).send({
      Error_message:
        'Missing destination folder in form, matching key "folderName"'
    });
  }
  // Check description type to be of type string
  if (description !== null && typeof description !== 'string') {
    return res.status(500).send({
      Error_message: 'image description must be of type string'
    });
  }

  if (req.file.path === null || undefined) {
    return res.status(500).send({
      Error_message:
        'No image found in request! You have to send a image appended to a form to this route.'
    });
  }

  try {
    /*
    Extract img form req object through req.file path and send to 
    Cloudinary upload function. Second parameter is foldername on Cloudinary 
    */

    const cloudinaryResult = await uploadImg(req.file.path, folderName);

    console.log(cloudinaryResult);

    /* 
    Result form upload is an object where public id and https link is saved and sent back in response
    */

    const { public_id, etag, secure_url } = await cloudinaryResult;

    const storeInCache = await promisify(client.hset).bind(client)(
      'imgs',
      'hash',
      etag
    );

    console.log(storeInCache);

    res.send({
      message: `image succefully saved on cloudinary in folder ${folderName}`,
      'img-link': secure_url,
      'public-id': public_id
    });
  } catch (err) {
    /* If error send error response with catched error as feedback */
    console.error(err);
    res.status(500).send({ Error_message: err });
  }

  tempStorageTruncate();
});
