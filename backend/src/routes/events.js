const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { authorizeRoles } = require('../middleware/roles');

router.post(
  '/',
  authorizeRoles('admin'),
  [
    body('title').notEmpty(),
    body('start_time').isISO8601(),
    body('end_time').isISO8601(),
    body('meet_point').isIn(['Clubhouse','Door Pickup','Other']),
    body('pickup_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('greggs_pickup').isBoolean()
  ],
  validate,
  eventController.create
);

router.get('/', eventController.list);
router.put('/:id', authorizeRoles('admin'), eventController.update);
router.delete('/:id', authorizeRoles('admin'), eventController.remove);

module.exports = router;
