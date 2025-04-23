const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');
const { authorizeRoles } = require('../middleware/roles');

// Manual join: rider picks a carpool
router.post(
  '/join/:carpoolId',
  authorizeRoles('rider'),
  riderController.joinCarpool
);

// Auto-match: rider requests to be auto-assigned
router.post(
  '/automatch/:eventId',
  authorizeRoles('rider'),
  riderController.autoMatch
);

// List co-riders for rider's carpool on an event
router.get(
  '/coriders/:eventId',
  authorizeRoles('rider'),
  riderController.listCoRiders
);

module.exports = router;
