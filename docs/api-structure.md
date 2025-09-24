# Complete Express.js API Structure for Fitness Tracking Application

## API Endpoint Structure

### Base URL: `/api/v1`

## 1. Authentication & Users

### Authentication Routes (`/api/v1/auth`)
```javascript
POST   /register           // User registration
POST   /login              // User login
POST   /logout             // User logout
POST   /refresh-token      // Refresh JWT token
POST   /forgot-password    // Request password reset
POST   /reset-password     // Reset password with token
POST   /verify-email       // Verify email address
POST   /resend-verification // Resend verification email
```

### User Profile Routes (`/api/v1/users`)
```javascript
GET    /profile            // Get current user profile
PUT    /profile            // Update user profile
DELETE /profile            // Delete user account
POST   /upload-avatar      // Upload profile picture
GET    /stats              // Get user statistics summary
GET    /dashboard          // Get dashboard data
PUT    /settings           // Update user settings
PUT    /preferences        // Update user preferences
```

## 2. Workout Management

### Workouts Routes (`/api/v1/workouts`)
```javascript
GET    /                   // Get user workouts (with pagination, filters)
POST   /                   // Create new workout
GET    /:id                // Get specific workout
PUT    /:id                // Update workout
DELETE /:id                // Delete workout
POST   /:id/duplicate      // Duplicate workout
GET    /stats              // Get workout statistics
GET    /calendar           // Get workouts for calendar view
GET    /recent             // Get recent workouts
POST   /quick-log          // Quick workout logging
```

### Exercise Library Routes (`/api/v1/exercises`)
```javascript
GET    /                   // Get exercises (with filters, search)
POST   /                   // Create new exercise (admin/trainer)
GET    /:id                // Get specific exercise
PUT    /:id                // Update exercise
DELETE /:id                // Delete exercise
GET    /categories         // Get exercise categories
GET    /muscle-groups      // Get muscle groups
GET    /equipment          // Get equipment types
POST   /:id/favorite       // Add to favorites
DELETE /:id/favorite       // Remove from favorites
GET    /favorites          // Get user's favorite exercises
```

### Workout Plans Routes (`/api/v1/workout-plans`)
```javascript
GET    /                   // Get workout plans (public + user's)
POST   /                   // Create new workout plan
GET    /:id                // Get specific workout plan
PUT    /:id                // Update workout plan
DELETE /:id                // Delete workout plan
POST   /:id/start          // Start following a plan
POST   /:id/complete       // Mark plan as completed
GET    /:id/progress       // Get plan progress
POST   /:id/rate           // Rate a workout plan
GET    /my-plans           // Get user's created plans
GET    /following          // Get plans user is following
```

## 3. Nutrition Management

### Nutrition Routes (`/api/v1/nutrition`)
```javascript
GET    /daily/:date        // Get nutrition for specific date
POST   /daily/:date        // Create/update daily nutrition
GET    /diary              // Get nutrition diary (date range)
POST   /log-food           // Log food item
PUT    /meals/:mealId      // Update meal
DELETE /meals/:mealId      // Delete meal
GET    /stats              // Get nutrition statistics
GET    /goals              // Get nutrition goals
PUT    /goals              // Update nutrition goals
GET    /trends             // Get nutrition trends
```

### Food Database Routes (`/api/v1/foods`)
```javascript
GET    /search             // Search foods
GET    /:id                // Get specific food
POST   /                   // Create custom food
PUT    /:id                // Update custom food
DELETE /:id                // Delete custom food
GET    /recent             // Get recently used foods
GET    /favorites          // Get favorite foods
POST   /:id/favorite       // Add to favorites
GET    /barcode/:code      // Get food by barcode
POST   /custom             // Create custom food entry
```

## 4. Goals & Progress Tracking

### Goals Routes (`/api/v1/goals`)
```javascript
GET    /                   // Get user goals
POST   /                   // Create new goal
GET    /:id                // Get specific goal
PUT    /:id                // Update goal
DELETE /:id                // Delete goal
POST   /:id/milestone      // Add milestone
PUT    /:id/progress       // Update goal progress
GET    /:id/history        // Get goal progress history
```

### Progress Routes (`/api/v1/progress`)
```javascript
GET    /                   // Get progress entries
POST   /                   // Create progress entry
GET    /:id                // Get specific progress entry
PUT    /:id                // Update progress entry
DELETE /:id                // Delete progress entry
POST   /photos             // Upload progress photos
GET    /measurements       // Get measurement history
GET    /weight-history     // Get weight history
GET    /body-composition   // Get body composition data
GET    /charts/:type       // Get chart data for specific metric
```

## 5. Analytics & Reports

### Analytics Routes (`/api/v1/analytics`)
```javascript
GET    /dashboard          // Get dashboard analytics
GET    /workout-summary    // Get workout analytics
GET    /nutrition-summary  // Get nutrition analytics
GET    /progress-summary   // Get progress analytics
GET    /trends/:type       // Get trends for specific metric
GET    /comparisons        // Get period comparisons
GET    /achievements       // Get user achievements
GET    /reports/:type      // Generate specific reports
```

## 6. Social Features (Optional)

### Social Routes (`/api/v1/social`)
```javascript
GET    /feed               // Get activity feed
POST   /share              // Share achievement/workout
GET    /friends            // Get friends list
POST   /friends/request    // Send friend request
PUT    /friends/accept     // Accept friend request
DELETE /friends/:id        // Remove friend
GET    /leaderboard        // Get leaderboard
POST   /challenges         // Create challenge
GET    /challenges         // Get available challenges
```

## API Response Structure

### Success Response Format
```javascript
{
  success: true,
  data: {
    // Response data
  },
  message: "Operation successful",
  meta: {
    timestamp: "2025-09-22T10:30:00Z",
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      pages: 5
    }
  }
}
```

### Error Response Format
```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: [
      {
        field: "email",
        message: "Email is required"
      }
    ]
  },
  meta: {
    timestamp: "2025-09-22T10:30:00Z",
    requestId: "req_123456"
  }
}
```

## Middleware Stack

### Global Middleware
```javascript
// Security
helmet()                    // Security headers
cors()                     // CORS configuration
rateLimit()               // Rate limiting
compression()             // Response compression

// Parsing
express.json()            // JSON body parser
express.urlencoded()      // URL encoded parser
cookieParser()           // Cookie parser

// Logging & Monitoring
morgan('combined')        // Request logging
requestId()              // Request ID generation
```

### Route-Specific Middleware
```javascript
// Authentication
authenticate()           // JWT verification
authorize(['admin'])     // Role-based authorization
validateApiKey()        // API key validation

// Validation
validateRequest()       // Input validation
sanitizeInput()         // Input sanitization
checkOwnership()       // Resource ownership

// Rate Limiting
workoutRateLimit()     // Specific limits for workout logging
uploadRateLimit()      // File upload limits
```

## File Upload Endpoints

### Upload Routes (`/api/v1/uploads`)
```javascript
POST   /avatar             // Upload user avatar
POST   /progress-photos    // Upload progress photos
POST   /exercise-media     // Upload exercise videos/images
POST   /documents          // Upload documents (meal plans, etc.)
DELETE /files/:id          // Delete uploaded file
```

## Real-time Features (WebSocket)

### Socket Events
```javascript
// Workout tracking
'workout:start'           // Start workout session
'workout:exercise:complete' // Complete exercise
'workout:end'             // End workout session

// Live updates
'progress:update'         // Progress milestone reached
'goal:achieved'          // Goal completed
'challenge:update'       // Challenge progress

// Social features
'friend:activity'        // Friend completed workout
'challenge:invite'       // Challenge invitation
```

## API Documentation

### Swagger/OpenAPI Documentation
- Complete API documentation with Swagger UI
- Request/response examples
- Authentication requirements
- Rate limiting information
- Error code references

### Postman Collection
- Pre-configured requests for all endpoints
- Environment variables for different stages
- Automated testing scenarios