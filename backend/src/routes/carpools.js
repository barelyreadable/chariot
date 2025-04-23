const express = require('express');
const router = express.Router();
const carpoolController = require('../controllers/carpoolController');
const { authorizeRoles } = require('../middleware/roles');

router.post('/:eventId/automatch', authorizeRoles('admin'), carpoolController.autoMatch);

router.get(
  '/:carpoolId/members',
  authorizeRoles('driver','admin'),
  carpoolController.listMembers
);
module.exports = router;
