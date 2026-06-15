import React, { useState } from 'react';

const API = process.env.REACT_APP_API;

function TaskForm({ fetchTasks, token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, deadline })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

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
        onChange={(e) => { setTitle(e.target.value); setError(''); }}
      />
      <input
        type="text"
        placeholder="Description... (e.g. Math chapter 5 exercises)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="deadline-row">
        <label> Deadline (optional):</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      {error && <div className="error-message"> {error}</div>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding...' : '+ Add Task'}
      </button>
    </div>
  );
}

export default TaskForm;