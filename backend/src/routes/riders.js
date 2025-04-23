// backend/src/routes/riders.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const riderController = require('../controllers/riderController');
const validate = require('../middleware/validate');
const { authorizeRoles } = require('../middleware/roles');

// Request seat in a carpool
router.post(
  '/join/:carpoolId',
  authorizeRoles('rider'),
  validate,
  riderController.joinCarpool
);

// Auto-match
router.post(
  '/automatch/:eventId',
  authorizeRoles('rider'),
  validate,
  riderController.autoMatch
);

// List co-riders
router.get(
  '/coriders/:eventId',
  authorizeRoles('rider'),
  riderController.listCoRiders
);

module.exports = router;
