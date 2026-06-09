import React, { useState } from 'react';

function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title) return;
    setLoading(true);
    try {
      await fetch('https://aitaskmanager-production-a46e.up.railway.app/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline })
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Task title... (e.g. Submit assignment)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description... (e.g. Math chapter 5 exercises)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="deadline-row">
        <label>📅 Deadline (optional):</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding...' : '+ Add Task'}
      </button>
    </div>
  );
}

export default TaskForm;