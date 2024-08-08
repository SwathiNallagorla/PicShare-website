const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

module.exports = (Photo, upload, body, validationResult) => {
  // Render upload form
  router.get('/', (req, res) => {
    res.render('upload', { errors: null });
  });

  // Handle photo upload
  router.post('/',
    upload.single('image'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('upload', { errors: errors.array() });
      }

      try {
        const newPhoto = new Photo({
          title: req.body.title,
          description: req.body.description,
          filename: req.file.filename
        });
        await newPhoto.save();
        res.redirect('/');
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );

  return router;
};