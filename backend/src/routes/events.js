// backend/src/routes/events.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { authorizeRoles } = require('../middleware/roles');

// Create
router.post(
  '/',
  authorizeRoles('admin'),
  [
    body('title').notEmpty(),
    body('start_time').isISO8601(),
    body('end_time').isISO8601(),
    body('meet_point').isIn(['Clubhouse','Door Pickup','Other']),
    body('pickup_time').matches(/^([01]\\d|2[0-3]):([0-5]\\d)$/),
    body('greggs_pickup').isBoolean(),
    body('journey_time_mins').isInt({ min: 0 })
  ],
  validate,
  eventController.create
);

// List
router.get('/', eventController.list);

// Update
router.put('/:id',
  authorizeRoles('admin'),
  eventController.update
);

// Delete
router.delete('/:id',
  authorizeRoles('admin'),
  eventController.remove
);

module.exports = router;
