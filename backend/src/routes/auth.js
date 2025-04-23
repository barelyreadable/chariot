const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'driver', 'rider'])
  ],
  validate,
  authController.signup
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  validate,
  authController.login
);

router.put(
  '/profile',
  verifyToken,
  upload.single('profile_picture'),
  authController.updateProfile
);

module.exports = router;
