import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, fetchTasks, title }) {
  if (tasks.length === 0) return null;

  return (
    <div className="task-section">
      <h2 className="section-title">{title}</h2>
      <div className="task-list">
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;