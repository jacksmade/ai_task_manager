import React from 'react';

const priorityColors = {
  'Urgent': '#ff4444',
  'Important': '#ff9800',
  'Can Wait': '#4caf50'
};

const effortColors = {
  'High': '#ff4444',
  'Medium': '#ff9800',
  'Low': '#4caf50'
};

function TaskItem({ task, fetchTasks }) {
  const handleDelete = async () => {
    await fetch(`https://aitaskmanager-production-a46e.up.railway.app/api/tasks/${task._id}`, {
      method: 'DELETE'
    });
    fetchTasks();
  };

  const handleToggle = async () => {
    await fetch(`https://aitaskmanager-production-a46e.up.railway.app/api/tasks/${task._id}/toggle`, {
      method: 'PATCH'
    });
    fetchTasks();
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-left">
          {task.priorityRank && (
            <span className="rank-badge">#{task.priorityRank}</span>
          )}
          <h3>{task.title}</h3>
        </div>
        <div className="task-buttons">
          <button onClick={handleToggle}>
            {task.completed ? '↩️ Undo' : '✅ Done'}
          </button>
          <button onClick={handleDelete} className="delete-btn">
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="description">{task.description}</p>
      )}

      {task.deadline && (
        <p className="deadline">
          📅 Due: {new Date(task.deadline).toDateString()}
        </p>
      )}

      <div className="tags-row">
        {task.priority && (
          <span
            className="tag"
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority}
          </span>
        )}
        {task.effortLevel && (
          <span
            className="tag"
            style={{ backgroundColor: effortColors[task.effortLevel] }}
          >
            ⚡ {task.effortLevel} Effort
          </span>
        )}
      </div>

      {task.aiReason && (
        <div className="ai-reason">
          <span>🤖 AI says:</span> {task.aiReason}
        </div>
      )}
    </div>
  );
}

export default TaskItem;