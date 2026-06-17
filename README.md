AI Task Manager
A full-stack intelligent task management application that leverages large language models to analyze and prioritize tasks based on deadlines, importance, and effort level. Users add their tasks and the system uses AI to rank them in order of priority with clear reasoning for each decision.
Live Demo
Frontend: https://ai-task-manager-ten-lovat.vercel.app
Backend API: https://aitaskmanager-production-a46e.up.railway.app

Features

User Authentication — Secure registration and login system using JWT tokens with bcrypt password hashing. Each user has an isolated private task list.
AI Task Validation — Every task is validated by an LLM before being saved to prevent meaningless or gibberish inputs.
Intelligent Prioritization — All incomplete tasks are sent together to the LLM which analyzes them holistically and returns a ranked list based on urgency, deadlines, and effort required.
Priority Classification — Each task is labeled as Urgent, Important, or Can Wait based on AI analysis.
Effort Estimation — AI estimates the effort level of each task as Low, Medium, or High.
Deadline Awareness — Users can set deadlines which the AI factors into its prioritization logic.
AI Reasoning — The AI provides a clear explanation for why each task was assigned its rank.
Task Completion Tracking — Tasks can be marked as complete and are displayed separately from active tasks.


Tech Stack
Frontend

React.js
Context API for global authentication state management
JWT token handling via localStorage
Deployed on Vercel

Backend

Node.js
Express.js
JWT for stateless authentication
bcryptjs for secure password hashing
Deployed on Railway

Database

MongoDB Atlas
Mongoose ODM for schema modeling and queries

AI Integration

Groq API
LLaMA 3.3 70B Versatile model
Used for task input validation and multi-task prioritization

Project Structure
ai_task_manager/
├── backend/
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── authRoutes.js
│   ├── .env
│   └── index.js
│
└── frontend/
    └── ai_taskmanager/
        ├── src/
        │   ├── components/
        │   │   ├── TaskForm.js
        │   │   ├── TaskList.js
        │   │   ├── TaskItem.js
        │   │   ├── Login.js
        │   │   └── Signup.js
        │   ├── context/
        │   │   └── AuthContext.js
        │   ├── App.js
        │   └── App.css
        └── .env

How AI Prioritization Works
User clicks "Prioritize My Tasks"
            |
Backend fetches all incomplete tasks for the authenticated user
            |
Tasks are formatted into a structured prompt with titles,
descriptions, and deadlines
            |
Prompt is sent to Groq API (LLaMA 3.3 70B)
            |
AI returns a JSON array with priority rank, priority tag,
effort level, and reasoning for each task
            |
Database is updated with AI-assigned rankings
            |
Frontend re-fetches and renders tasks in ranked order

Getting Started
Prerequisites

Node.js v18 or higher
MongoDB Atlas account
Groq API key — available free at console.groq.com

Backend Setup
cd backend
npm install

Create a .env file in the backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
Start the server:
bashnode index.js
Frontend Setup
bashcd frontend/ai_taskmanager
npm install
Create a .env file in the frontend directory:
REACT_APP_API=http://localhost:5000
Start the development server:
bashnpm start
The application will be available at http://localhost:3000

API Reference
Authentication
MethodEndpointDescriptionAuth RequiredPOST/api/auth/registerRegister a new userNoPOST/api/auth/loginLogin and receive JWT tokenNo
Tasks
MethodEndpointDescriptionAuth RequiredGET/api/tasksRetrieve all tasks for authenticated userYesPOST/api/tasksCreate a new task with AI validationYesPOST/api/tasks/prioritizeTrigger AI prioritization for all tasksYesDELETE/api/tasks/:idDelete a specific taskYesPATCH/api/tasks/:id/toggleToggle task completion statusYes
All protected routes require an Authorization: Bearer <token> header.

Environment Variables
Backend
VariableDescriptionPORTPort number the server runs onMONGO_URIMongoDB Atlas connection stringGROQ_API_KEYAPI key for Groq LLM accessJWT_SECRETSecret key used for signing JWT tokens
Frontend
VariableDescriptionREACT_APP_APIBase URL of the backend API

Deployment
The application is deployed using the following services:

Backend — Railway with environment variables configured via the Railway dashboard
Frontend — Vercel with REACT_APP_API set as a production environment variable
Database — MongoDB Atlas free tier with network access open to all IPs for cloud deployment


Author
Maham Rafiq
Computer Science Graduate, University of Engineering and Technology Lahore

GitHub: github.com/jacksmade
Email: mahamrafiq333@gmail.com
LinkedIn: linkedin.com/in/mahamrafiq


License
This project is open source and available under the MIT License.
