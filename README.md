# NutriFit - Complete Health & Fitness Tracking Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

## Overview

*NutriFit* is a comprehensive full-stack web application designed to help users track their fitness journey, monitor nutrition intake, and achieve their health goals. Built with modern technologies, it provides an intuitive interface for managing workouts, meals, health metrics, and progress tracking.

## Key Features

### *Authentication & User Management*
- Secure user registration and login system
- JWT-based authentication with protected routes
- User profile management with customizable settings
- Password encryption using bcryptjs

### *Workout Management*
- *Exercise Library*: 40+ predefined exercises across 9 categories
- *Custom Workouts*: Create personalized workout routines
- *Detailed Tracking*: Sets, reps, weight, duration, and calories burned
- *Workout History*: View, edit, and delete previous workouts
- *Progress Visualization*: Track workout performance over time

### *Nutrition Tracking*
- *Meal Logging*: Track breakfast, lunch, dinner, and snacks
- *Food Database*: Built-in database with nutritional information
- *Macro Tracking*: Monitor calories, protein, carbs, fats, and fiber
- *Smart Filtering*: Filter meals by type, date, and nutritional content
- *Daily Summaries*: View comprehensive daily nutrition overview

### *Health Metrics & Analytics*
- *Dashboard Overview*: Quick stats and recent activity
- *Progress Tracking*: Monitor weight, body measurements, and fitness goals
- *Data Visualization*: Charts and graphs for trend analysis
- *Goal Setting*: Set and track custom fitness and nutrition goals

### *Modern User Experience*
- *Responsive Design*: Optimized for desktop and mobile devices
- *Intuitive Interface*: Clean, modern UI with smooth navigation
- *Real-time Updates*: Instant feedback and notifications
- *Dark/Light Theme*: Comfortable viewing in any environment

## Technology Stack

### *Frontend*
- *React 18.2* - Modern UI library with hooks and context
- *React Router 6* - Client-side routing and navigation
- *Tailwind CSS* - Utility-first styling framework
- *Heroicons* - Beautiful SVG icon library
- *Chart.js & Recharts* - Data visualization components
- *Axios* - HTTP client for API communication
- *React Hook Form* - Form validation and management
- *React Hot Toast* - Elegant notification system

### *Backend*
- *Node.js & Express* - Server-side JavaScript runtime and framework
- *MongoDB & Mongoose* - NoSQL database with object modeling
- *JWT* - Secure token-based authentication
- *Express Validator* - Input validation and sanitization
- *bcryptjs* - Password hashing and encryption
- *Helmet* - Security middleware for Express apps
- *CORS* - Cross-origin resource sharing configuration

## Getting Started

### Prerequisites
- *Node.js* (v16 or higher)
- *MongoDB* (running locally or MongoDB Atlas)
- *npm* or *yarn* package manager


### Access the Application
- *Frontend*: http://localhost:5173
- *Backend API*: http://localhost:5001

## Application Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=NutriFit+Dashboard)
Real-time overview of your fitness journey with quick stats and recent activities

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Workouts
- GET /api/workouts - Get user workouts
- POST /api/workouts - Create new workout
- GET /api/workouts/:id - Get workout details
- PUT /api/workouts/:id - Update workout
- DELETE /api/workouts/:id - Delete workout

### Nutrition
- GET /api/nutrition - Get nutrition entries
- POST /api/nutrition - Create nutrition entry
- PUT /api/nutrition/:id - Update nutrition entry
- DELETE /api/nutrition/:id - Delete nutrition entry

## Acknowledgments

- *React Team* for the amazing frontend framework
- *MongoDB* for the flexible NoSQL database
- *Tailwind CSS* for the utility-first styling approach
- *Heroicons* for the beautiful icon library
- *All contributors* who helped make this project better

---

<p align="center">
  <em>Track your journey, achieve your goals!</em>
</p>
