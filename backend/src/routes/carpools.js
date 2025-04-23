// backend/src/routes/carpools.js
const express = require('express');
const router = express.Router();
const carpoolController = require('../controllers/carpoolController');
const { authorizeRoles } = require('../middleware/roles');

// Driver opt-in
router.post(
  '/:eventId/subscribe',
  authorizeRoles('driver'),
  carpoolController.subscribe
);

// List carpools for event
router.get(
  '/:eventId',
  authorizeRoles('driver','admin','rider'),
  carpoolController.list
);

// List riders in a carpool
router.get(
  '/:carpoolId/members',
  authorizeRoles('driver','admin'),
  carpoolController.listMembers
);

// Toggle Greggs
router.patch(
  '/:carpoolId/greggs-toggle',
  authorizeRoles('driver'),
  carpoolController.toggleGreggs
);

module.exports = router;
