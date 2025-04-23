// backend/src/routes/drivers.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const driverController = require('../controllers/driverController');
const validate = require('../middleware/validate');
const { authorizeRoles } = require('../middleware/roles');

// Create/update profile
router.post(
  '/',
  authorizeRoles('driver'),
  [
    body('name').notEmpty(),
    body('vehicle_info').notEmpty(),
    body('capacity').isInt({ min: 1 })
  ],
  validate,
  driverController.createOrUpdate
);

// List all drivers
router.get('/', authorizeRoles('driver','admin'), driverController.list);

module.exports = router;
