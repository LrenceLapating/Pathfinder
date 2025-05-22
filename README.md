# PathFinder Learning Platform

PathFinder is a modern web application for online education with personalized learning paths and course management.

## Getting Started

These instructions will help you set up and run the PathFinder application on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup

1. Create the database and tables using the provided SQL script:

```bash
# Log into MySQL
mysql -u root -p

# Then run the SQL script
source pathfinder_schema.sql
```

Alternatively, you can import the SQL file using a tool like MySQL Workbench.

### Environment Setup

1. Create a `.env` file in the server directory:

```bash
# Navigate to server directory
cd server

# Create .env file with the following content:
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pathfinder
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Replace `your_mysql_password` with your actual MySQL password and `your_secret_key` with a secure random string for JWT token signing.

2. Create a `.env` file in the root directory for frontend environment variables:

```bash
# Create .env file in the root directory
VUE_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the consent screen with your app information
6. Select "Web application" as the application type
7. Add your domain to the "Authorized JavaScript origins" (e.g., http://localhost:8080 for development)
8. Add your redirect URI to the "Authorized redirect URIs" (e.g., http://localhost:8080)
9. Click "Create" and copy the Client ID
10. Paste the Client ID in your `.env` file as the `VUE_APP_GOOGLE_CLIENT_ID` value

### Installing Dependencies

```bash
# Install backend dependencies
npm install

# Start the backend server
npm run dev
```

The server will start on http://localhost:5000.

### Running the Frontend

```bash
# In a separate terminal, start the Vue.js frontend
npm run serve
```

The frontend will start on http://localhost:8080.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `POST /api/auth/google` - Google OAuth authentication

## Features

- User authentication with JWT
- Google OAuth integration
- Modern UI with animations
- Course management system
- Progress tracking
- Quiz and assessment system
- Certificates for completed courses

## Built With

- [Vue.js](https://vuejs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MySQL](https://www.mysql.com/) - Database
- [Node.js](https://nodejs.org/) - Server environment

## Features Implemented

### 1. Authentication
- Login
- Registration

### 2. Student Dashboard
- View current grades and progress
- See personalized insights based on performance
- Access areas needing improvement

### 3. Auto-Generated Study Guides
- Summaries of weak topics
- Practice questions with feedback
- Suggested learning resources (videos, quizzes)
- Personalized study schedules with completion tracking

### 4. Progress Tracking
- Monitor improvement across subjects
- View completion status of study guides
- Receive personalized recommendations
- See detailed progress analytics

## Project Structure

```
pathfinder/
├── public/                 # Static files
├── src/                    # Source code
│   ├── assets/             # Styles, images, etc.
│   │   └── css/            # CSS files
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   └── layout/         # Layout components
│   ├── App.tsx             # Main App component
│   └── index.tsx           # Entry point
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Future Development

- Teacher dashboard for uploading grades
- Automated intervention suggestions
- Subject-topic level performance analysis
- Advanced data visualization with Chart.js
- Backend API integration

## Technologies Used

- React
- TypeScript
- React Router
- Chart.js (for future data visualization)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 