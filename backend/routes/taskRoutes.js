const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
  prioritizeTasks
} = require('../controllers/taskController');

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.post('/prioritize', auth, prioritizeTasks);
router.delete('/:id', auth, deleteTask);
router.patch('/:id/toggle', auth, toggleTask);

module.exports = router;