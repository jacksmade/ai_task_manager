import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './context/AuthContext';
import './App.css';

const API = process.env.REACT_APP_API;

function App() {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prioritizing, setPrioritizing] = useState(false);
  const [prioritized, setPrioritized] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const fetchTasks = async (currentToken) => {
  const useToken = currentToken || token;
  try {
    const res = await fetch(`${API}/api/tasks`, {
      headers: { Authorization: `Bearer ${useToken}` }
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('Fetch error:', data.message);
      setTasks([]);
      setLoading(false);
      return;
    }

    // Make sure data is array before setting
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  } catch (err) {
    console.log('Fetch error:', err);
    setTasks([]);
    setLoading(false);
  }
};

  const handlePrioritize = async () => {
    setPrioritizing(true);
    setPrioritized(false);
    try {
      const res = await fetch(`${API}/api/tasks/prioritize`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const data = await res.json();
        console.log('Error:', data.message);
        setPrioritizing(false);
        return;
      }

      await fetchTasks();
      setPrioritized(true);
    } catch (err) {
      console.log('Prioritize error:', err);
    }
    setPrioritizing(false);
  };

  useEffect(() => {
    if (token) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const incompleteTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.priorityRank && b.priorityRank) return a.priorityRank - b.priorityRank;
      if (a.priorityRank) return -1;
      if (b.priorityRank) return 1;
      return 0;
    });

  const completedTasks = tasks.filter(t => t.completed);

  if (!token) {
    return showLogin
      ? <Login onSwitch={() => setShowLogin(false)} />
      : <Signup onSwitch={() => setShowLogin(true)} />;
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>AI Task Manager</h1>
        <div className="user-info">
          <span> {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <p className="subtitle">Add your tasks, then let AI prioritize them for you</p>

      <TaskForm fetchTasks={fetchTasks} token={token} />

      {tasks.filter(t => !t.completed).length >= 2 && (
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
           AI has ranked your tasks! Start from Task #1.
        </div>
      )}

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <>
          {incompleteTasks.length === 0 && completedTasks.length === 0 && (
            <p className="no-tasks">No tasks yet! Add some above </p>
          )}
          <TaskList tasks={incompleteTasks} fetchTasks={fetchTasks} token={token} title="My Tasks" />
          {completedTasks.length > 0 && (
            <TaskList tasks={completedTasks} fetchTasks={fetchTasks} token={token} title=" Completed" />
          )}
        </>
      )}
    </div>
  );
}

export default App;