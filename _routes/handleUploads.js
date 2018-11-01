const Router = require('express-promise-router');
const router = new Router();
const { handleFormData, uploadImg } = require('../_image-and-video-storage');

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

  try {
    /*

    Extract img form req object through req.file path and send to 
    Cloudinary upload function. Second parameter is foldername on Cloudinary 
    
    */
    const cloudinaryResult = await uploadImg(req.file.path, folderName);

    /* 

    Result form upload is an object where public id and https link is saved and sent back in response
    
    */
    const img = await cloudinaryResult.secure_url;
    const publicId = await cloudinaryResult.public_id;
    res.send({
      message: `image succefully saved on cloudinary in folder ${folderName}`,
      'img-link': img,
      'public-id': publicId
    });
  } catch (err) {
    /* If error send error response with catched error as feedback */

    res.status(500).send({ Error_message: err });
  }
});
