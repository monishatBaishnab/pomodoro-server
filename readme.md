### Time Management and Focus Tracker - Backend Overview

This backend service provides an API for managing the **Time Management and Focus Tracker** feature, including user authentication, focus session logging, focus analytics, and gamified rewards such as badges and streak tracking.

### API Endpoints

#### 1. **POST /login**
   - **Purpose**: Authenticate a user and provide a JWT token.

#### 2. **POST /register**
   - **Purpose**: Register a new user.

#### 3. **POST /focus-session**
   - **Purpose**: Log a completed focus session.

#### 4. **GET /focus-metrics**
   - **Purpose**: Fetch daily and weekly focus metrics for a user.

#### 5. **GET /streaks**
   - **Purpose**: Fetch the current and longest streak for a user.

#### 6. **POST /badges/user**
   - **Purpose**: Create a badge for a user when a milestone is achieved.

#### 7. **GET /badges/user**
   - **Purpose**: Fetch the badges assigned to a user.

---

### Features Breakdown

#### 1. **Pomodoro Timer**
   - Allows users to manage their study time in 25-minute focus intervals, followed by 5-minute breaks.
   - Features buttons for starting, pausing, and resetting the timer.
   - Visual and audio notifications notify users when a session ends.

#### 2. **Focus Analytics**
   - Displays daily and weekly focus time metrics.
   - Visualizes analytics through charts like bar charts, pie charts, or heatmaps.
   - Tracks the number of sessions completed and total focus time.

#### 3. **Gamification**
   - Users earn badges and progress bars to encourage consistency in focus sessions.
   - Longest streaks are highlighted, motivating continued study habits.
   - Users can view their earned badges and progress via the API.

#### 4. **Backend Caching & Performance**
   - Redis caching optimizes retrieval of daily and weekly metrics for faster performance.
   - Redis-based rate limiting ensures smooth and reliable API performance.

---

### Authentication

- **JWT (JSON Web Tokens)** is used to securely authenticate users and manage API access.
- **POST /login**: Authenticate a user and issue a JWT token.
- **POST /register**: Register a new user by providing necessary details (email, password, etc.).
- All other API endpoints are protected and require the user to be authenticated via JWT.

---

### Real-Time Updates

- The Pomodoro timer updates dynamically without requiring a page refresh, ensuring real-time data.
- The focus analytics dashboard automatically reflects newly completed sessions.
