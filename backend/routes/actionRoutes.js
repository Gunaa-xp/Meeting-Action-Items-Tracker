const express = require('express');
const {
  getActions,
  createAction,
  updateAction,
  deleteAction,
} = require('../controllers/actionController');

const router = express.Router();

router.get('/', getActions);
router.post('/', createAction);
router.put('/:id', updateAction);
router.delete('/:id', deleteAction);

module.exports = router;
