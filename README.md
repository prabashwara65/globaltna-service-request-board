# GlobalTNA Service Request Board

A full-stack web application where homeowners can post service requests and tradespeople can browse, update, and manage jobs. Built for GlobalTNA Full-Stack Developer Intern assessment.


### Core Features
-  Home page with service request cards and category filter
-  Keyword search across title and description
-  New job form with client-side validation
-  Job detail page with status dropdown and delete button
-  Full REST API (GET, POST, PATCH, DELETE)
-  MongoDB with Mongoose ODM

### Bonus Features
-  JWT-based authentication (login/register)
-  Protected actions (edit/delete requires login)
-  Seed script with 10 sample jobs
-  Unit tests for API endpoints

### Design Features
-  Dark theme with custom styling
-  Responsive grid layout (mobile, tablet, desktop)
-  Custom scrollbar matching theme
-  Category-colored icon backgrounds
-  Hover animations and transitions


# Setup Instructions
## Step 1: Clone the Repository

git clone https://github.com/prabashwara65/globaltna-service-request-board.git
cd globaltna-service-request-board


## Step 2: Install Backend Dependencies

cd backend
npm install

### Backend .env 
MONGODB_URI=mongodb+srv://prabashwara65_db_user:cB6mZ92ii5lFlFZT@cluster0.cpz5u70.mongodb.net/?appName=Cluster0
PORT=5050
JWT_SECRET=my_secret_jwt_key

## Step 3: Install Frontend Dependencies

cd frontend
npm install


## Start the Backend Server
Open a terminal and run:

cd backend
npm start

### Open another terminal and run:

cd frontend
npm run dev

##  Database Seeding
### Open a terminal and run:

cd backend
node seed.js

## Step 4: Open the Application
Open your browser and navigate to: http://localhost:3000

### Sample Login Credentials
email - user@gmail.com
pass - user123

## Step 5: Run Unit Tests (Backend)
### Open a terminal and run:

cd backend
npm test
