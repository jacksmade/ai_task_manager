const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
  prioritizeTasks
} = require('../controllers/TaskController');

router.get('/', getTasks);
router.post('/', createTask);
router.post('/prioritize', prioritizeTasks);  // 👈 MUST be before /:id routes
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

module.exports = router;