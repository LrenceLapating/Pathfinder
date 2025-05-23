# PathFinder

A learning path management application with both Vue.js and React implementations.

## Project Structure

The project has been organized to support both Vue.js and React frameworks:

```
pathfinder/
├── config/                  # Consolidated configuration files
│   ├── db/                  # Database configuration
│   └── oauth/               # OAuth configuration
├── public/                  # Static assets
├── server/                  # Backend Express server
│   ├── controllers/         # API controllers
│   ├── models/              # Database models
│   └── routes/              # API routes
├── src/                     # Frontend source code
│   ├── assets/              # Shared assets (images, styles)
│   ├── components/          # Shared components
│   ├── react/               # React-specific code
│   │   ├── App.tsx          # React application root
│   │   └── index.tsx        # React entry point
│   ├── vue/                 # Vue-specific code
│   │   ├── App.vue          # Vue application root
│   │   └── main.js          # Vue entry point
│   └── index.js             # Main entry point (selects framework)
└── package.json             # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=pathfinder
   VUE_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### Running the Application

#### Vue.js Version

```
npm run serve:vue
```

#### React Version

```
npm run serve:react
```

#### Backend Server

```
npm run dev
```

## Building for Production

### Vue.js Version

```
npm run build:vue
```

### React Version

```
npm run build:react
```

## License

This project is licensed under the MIT License. 