# AdVista

TMU Classifieds Web Interface

Welcome to the TMU Classifieds Web Interface project, a commercial-grade digital marketplace designed exclusively for the TMU student community. This platform bridges the gap between students seeking to buy, sell, or exchange goods and services, fostering a vibrant, supportive network within the campus.

🚀 Project Overview

TMU Classifieds is more than just a marketplace; it's a community-driven platform where students can connect, exchange academic services, and trade goods seamlessly. Whether you're looking to buy textbooks, sell an old laptop, or find a study group, TMU Classifieds is your go-to campus hub.

Key Features:
User Authentication: Secure login and registration, ensuring a safe, student-only marketplace.
Responsive Design: A seamless browsing experience on both desktop and mobile devices.
Classified Ad Categories: Organized sections for "Items Wanted," "Items for Sale," and "Academic Services."
Search Functionality: Advanced search with filters to find exactly what you need.
Ad Posting Interface: User-friendly posting of new ads with multimedia support.
Communication Platform: In-app messaging to connect buyers and sellers securely.
Admin Dashboard: Comprehensive tools for site management and content moderation.
Mobile Optimization: Full functionality across a variety of mobile devices for on-the-go access.

🛠 Technical Stack

Front-End: Developed with HTML5, CSS3, and React.js for a dynamic, responsive UI.

Back-End: Powered by Node.js and Express, with a robust database management system.

Database: Utilizes MongoDB for efficient data storage and retrieval.

API Integration: Incorporates essential APIs for added functionality like maps and payment gateways.

Security: Implements best practices in web security to protect user data and transactions.

# Development Server

## Frontend

1. `cd frontend`
2. `npm start`
3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
4. Make changes to the code and the page will reload automatically.

## Backend

1. `cd backend`
2. Add .env file for environment variables
3. Install dependencies with `npm ci`
4. Start the server with `npm run devstart`
5. The server will be started on http://localhost:8080

## API Endpoints

### Authentication

The application provides the following authentication endpoints:

#### POST /auth/register

Registers a new user.

Request body:

```json
{
  "name": "<name>",
  "email": "<email>",
  "password": "<password>"
}
```

#### POST /auth/login

Logs in a user.

Request body:

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

#### GET /user

Displays all the users in the database

#### GET /user/:id

Display a user with the specific id

#### PUT /user/update/:id

Updates the information of the specific user

#### DELETE /user/delete/:id

Deletes the specific user from the database

#### POST /ad

Adds a new post to the database

'''Form-data'''

#### PUT /ad/:id

Updates the post of the specific user

#### GET /ad

Displays all the posts in the database

#### DELETE /ad/delete/:id

Deletes the post from a specific user
