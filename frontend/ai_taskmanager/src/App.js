import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prioritizing, setPrioritizing] = useState(false);
  const [prioritized, setPrioritized] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.log('Fetch error:', err);
      setLoading(false);
    }
  };

  const handlePrioritize = async () => {
    setPrioritizing(true);
    setPrioritized(false);
    try {
      const res = await fetch('http://localhost:5000/api/tasks/prioritize', {
        method: 'POST'
      });
      const data = await res.json();
      setTasks(data);
      setPrioritized(true);
    } catch (err) {
      console.log('Prioritize error:', err);
    }
    setPrioritizing(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const incompleteTasks = tasks
  .filter(t => !t.completed)
  .sort((a, b) => {
    if (a.priorityRank && b.priorityRank) return a.priorityRank - b.priorityRank;
    if (a.priorityRank) return -1;
    if (b.priorityRank) return 1;
    return 0;
  });
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="app">
      <h1>🧠 AI Task Manager</h1>
      <p className="subtitle">Add your tasks, then let AI prioritize them for you</p>

      <TaskForm fetchTasks={fetchTasks} />

      {incompleteTasks.length >= 2 && (
        <button
          className="prioritize-btn"
          onClick={handlePrioritize}
          disabled={prioritizing}
        >
          {prioritizing ? '🤖 AI is thinking...' : '✨ Prioritize My Tasks with AI'}
        </button>
      )}

      {prioritized && (
        <div className="prioritized-banner">
          ✅ AI has ranked your tasks! Start from Task #1.
        </div>
      )}

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <>
          {incompleteTasks.length === 0 && completedTasks.length === 0 && (
            <p className="no-tasks">No tasks yet! Add some above ☝️</p>
          )}

          <TaskList
            tasks={incompleteTasks}
            fetchTasks={fetchTasks}
            title="📋 My Tasks"
          />

          {completedTasks.length > 0 && (
            <TaskList
              tasks={completedTasks}
              fetchTasks={fetchTasks}
              title="✅ Completed"
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;