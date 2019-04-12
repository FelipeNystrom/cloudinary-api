const Router = require('express-promise-router');
const router = new Router();
const { handleFormData, deleteImg } = require('../_image-and-video-storage');
const { uploadOrUpdateImg } = require('../_helpers');

module.exports = router;

router.post('/upload', handleFormData.single('img'), uploadOrUpdateImg);

router.put('/update', handleFormData.single('img'), uploadOrUpdateImg);

router.delete('/delete', handleFormData.none(), async (req, res) => {
  const {
    body: { folderName, imgId }
  } = req;

  if (!folderName) {
    return res
      .status(400)
      .send({ Error_message: 'Missing parameter folderName' });
  }

  if (!imgId) {
    return res.status(400).send({ Error_message: 'Missing parameter imgId' });
  }

  try {
    const cloudinaryResult = await deleteImg(imgId);

    if (cloudinaryResult === 'not found') {
      return res.status(404).send({ Error_message: cloudinaryResult });
    }

    return res.send({ message: cloudinaryResult });
  } catch (error) {
    res.status(500).send({ Error_message: error });
  }
});
