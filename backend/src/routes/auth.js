const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

// Signup
router.post(
  '/signup',
  upload.single('profile_picture'),
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin','driver','rider']),
    body('greggs_pref').optional().isIn(['Bacon Roll','Sausage Roll','Omlette Roll','Bacon Sausage Roll','Bacon Omlette Roll','Sausage Omlette Roll','Daddy Roll','Porridge']),
    body('drink_pref').optional().isIn(['Latte','Cappucino','Black Coffee','White Coffee','Orange Juice','Water']),
  ],
  validate,
  authController.signup
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  validate,
  authController.login
);

// Get current user
router.get(
  '/me',
  verifyToken,
  authController.me
);

// Update profile
router.put(
  '/profile',
  verifyToken,
  upload.single('profile_picture'),
  [
    body('greggs_pref').optional().isString(),
    body('drink_pref').optional().isString(),
  ],
  validate,
  authController.updateProfile
);

module.exports = router;
