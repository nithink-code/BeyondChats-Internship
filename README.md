# BeyondChats Article Management System

A full-stack web application for managing, scraping, and enhancing articles with a modern React frontend and Express/MongoDB backend.

## 🚀 Project Overview

This project consists of two main components:
1. **Backend**: An Express.js server that handles article scraping, storage (MongoDB), and AI enhancement.
2. **Frontend**: A modern React.js application offering a responsive and professional user interface to interact with the system.

## 🏗️ Architecture & Data Flow

```mermaid
graph TD
    User[User] -->|Interacts with| UI[React Frontend]
    UI -->|HTTP Requests| API[Express Backend API]
    API -->|CRUD Operations| DB[(MongoDB Database)]
    API -->|Scrapes| Web[External Blogs/Articles]
    API -->|Enhances User Content| AI[AI Service]
    
    subgraph Frontend "React + Vite"
        UI -->|Pages| Home
        UI -->|Pages| ArticleList
        UI -->|Pages| ArticleDetail
        UI -->|Pages| ArticleForm
    end
    
    subgraph Backend "Node.js + Express"
        API -->|Routes| Routes
        Routes -->|Controllers| Controllers
        Controllers -->|Models| Models
    end
```

### Key Features
- **Article Scraping**: Automatically fetch articles from external sources.
- **Article Management**: Create, Read, Update, and Delete (CRUD) articles.
- **AI Enhancement**: (Backend capability) Enhance article content using AI services.
- **Responsive UI**: Beautiful, dark-themed interface built with modern CSS variables and glassmorphism design.
- **Real-time Search**: Instant filtering and searching of the article library.

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local instance or Atlas connection string)
- Git

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the `backend` directory based on `.env.example`.
   - Ensure `MONGODB_URI` aligns with your database.
   - Set `PORT` (default is 5000).

4. Start the backend server:
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000` (or the port shown in your terminal).

## 📁 Project Structure

```
BeyondChats/
├── backend/                 # Express.js Server
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Helper utilities
│   └── server.js            # Entry point
│
├── frontend/                # React.js Application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application views/routes
│   │   ├── services/        # API integration services
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML template
│   └── vite.config.js       # Vite configuration
│
└── README.md                # Project documentation
```

## 🎨 Design System

The frontend uses a custom CSS variable-based design system featuring:
- **Color Palette**: HSL-based colors for easy theming (Dark mode by default).
- **Typography**: Uses 'Inter' from Google Fonts.
- **Effects**: Glassmorphism, smooth transitions, and micro-interactions.
- **Responsiveness**: Mobile-first design approach.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
