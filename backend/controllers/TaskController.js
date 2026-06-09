const Task = require('../models/Task');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priorityRank: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a task (no AI here anymore — just save)
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    console.log('📥 Creating task:', title);
    const task = await Task.create({ title, description, deadline });
    console.log('✅ Task created');
    res.status(201).json(task);
  } catch (err) {
    console.log('❌ Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle complete
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// AI Prioritize ALL tasks
exports.prioritizeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ completed: false });

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks to prioritize' });
    }

    // Build task list for AI
    const taskList = tasks.map((t, i) => {
      const deadline = t.deadline
        ? `Deadline: ${new Date(t.deadline).toDateString()}`
        : 'No deadline';
      return `Task ${i + 1}:
      - ID: ${t._id}
      - Title: ${t.title}
      - Description: ${t.description || 'None'}
      - ${deadline}`;
    }).join('\n\n');

    const today = new Date().toDateString();

    const prompt = `
Today is ${today}.

You are a smart productivity assistant. Analyze these tasks and prioritize them.

${taskList}

For each task return a JSON array (no extra text, just JSON) like this:
[
  {
    "id": "task_id_here",
    "priorityRank": 1,
    "priority": "Urgent",
    "effortLevel": "High",
    "aiReason": "This should be done first because..."
  }
]

Rules:
- priorityRank starts from 1 (1 = do first)
- priority must be one of: Urgent, Important, Can Wait
- effortLevel must be one of: Low, Medium, High
- aiReason should explain clearly why this rank in 1-2 sentences
- Consider deadlines, importance, and effort needed
- Return ONLY the JSON array, no other text
`;

    console.log('🤖 Asking AI to prioritize...');

    const aiResponse = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile'
    });

    const rawText = aiResponse.choices[0].message.content;
    console.log('AI response:', rawText);

    // Parse AI response
    const parsed = JSON.parse(rawText);

    // Update each task in DB
    for (const item of parsed) {
      await Task.findByIdAndUpdate(item.id, {
        priorityRank: item.priorityRank,
        priority: item.priority,
        effortLevel: item.effortLevel,
        aiReason: item.aiReason
      });
    }

    // Return updated tasks
    const updatedTasks = await Task.find().sort({ priorityRank: 1, createdAt: -1 });
    res.json(updatedTasks);

  } catch (err) {
    console.log('❌ Prioritize error:', err.message);
    res.status(500).json({ message: err.message });
  }
};