# Backend API Design & Scalability Plan

This document details the backend REST API specifications for the Movie Ticket Booking Platform. It outlines the endpoint definitions, payloads, and the architectural decisions made to ensure security, high concurrency, and horizontal scalability.

---

## 1. API Specifications

### 1.1 Authentication & Profile
All requests to protected routes must include the token in the headers: `Authorization: Bearer <JWT_TOKEN>`.

#### `POST /api/users/register`
*   **Purpose**: Registers a new user.
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": 12,
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user",
          "created_at": "2026-06-21T23:52:00Z"
        }
      }
    }
    ```

#### `POST /api/users/login`
*   **Purpose**: Authenticates a user and issues a JWT token.
*   **Request Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "user": {
          "id": 12,
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user"
        },
        "token": "eyJhbGciOiJIUzI1NiIsIn..."
      }
    }
    ```

---

### 1.2 Movies & Showtimes

#### `GET /api/movies`
*   **Purpose**: Retrieves list of active/upcoming movies. Supports pagination.
*   **Query Parameters**:
    *   `page`: Page number (default: 1)
    *   `limit`: Items per page (default: 10)
    *   `search`: Filter by movie title
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "results": 1,
      "page": 1,
      "data": {
        "movies": [
          {
            "id": 1,
            "title": "Inception",
            "description": "A thief who steals corporate secrets...",
            "duration_mins": 148,
            "genre": "Sci-Fi",
            "release_date": "2010-07-16"
          }
        ]
      }
    }
    ```

#### `GET /api/movies/:id`
*   **Purpose**: Retrieves details of a specific movie.
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "movie": {
          "id": 1,
          "title": "Inception",
          "description": "A thief who steals corporate secrets...",
          "duration_mins": 148,
          "genre": "Sci-Fi",
          "release_date": "2010-07-16"
        }
      }
    }
    ```

#### `GET /api/shows`
*   **Purpose**: Retrieves showtimes for a specific movie or date.
*   **Query Parameters**:
    *   `movie_id`: Filter by movie ID (required)
    *   `date`: Filter by show date (YYYY-MM-DD)
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "shows": [
          {
            "id": 45,
            "movie_id": 1,
            "screen_name": "Screen 1",
            "start_time": "2026-06-22T14:00:00Z",
            "end_time": "2026-06-22T16:28:00Z",
            "price": "12.50"
          }
        ]
      }
    }
    ```

#### `GET /api/shows/:id/seats`
*   **Purpose**: Fetches real-time seat layout status (available, locked, booked) for a specific show. Required for the interactive seating chart.
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "show_id": 45,
        "seats": [
          {
            "show_seat_id": 201,
            "seat_id": 1,
            "row_num": "A",
            "col_num": 1,
            "type": "standard",
            "status": "available",
            "locked_until": null
          },
          {
            "show_seat_id": 202,
            "seat_id": 2,
            "row_num": "A",
            "col_num": 2,
            "type": "standard",
            "status": "locked",
            "locked_until": "2026-06-22T00:05:00Z"
          }
        ]
      }
    }
    ```

---

### 1.3 Booking & Real-Time Seat Locking

#### `POST /api/bookings/lock` (Protected)
*   **Purpose**: Temporarily reserves seats (10 minutes) and registers a pending booking. Returns the Stripe payment credentials.
*   **Request Body**:
    ```json
    {
      "show_id": 45,
      "seat_ids": [1, 2]
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "status": "success",
      "message": "Seats locked successfully. Please complete payment within 10 minutes.",
      "data": {
        "booking_id": 501,
        "total_price": "25.00",
        "locked_until": "2026-06-22T00:10:00Z",
        "client_secret": "pi_3M3..._secret_xyzabc"
      }
    }
    ```

#### `POST /api/bookings/:id/cancel` (Protected)
*   **Purpose**: User cancels their booking. Returns a refund for confirmed bookings and releases show seats immediately.
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Booking cancelled successfully. Refund has been initiated."
    }
    ```

#### `GET /api/bookings/history` (Protected)
*   **Purpose**: Gets the authenticated user's past and current bookings.
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "data": {
        "bookings": [
          {
            "booking_id": 501,
            "movie_title": "Inception",
            "start_time": "2026-06-22T14:00:00Z",
            "seats": ["A1", "A2"],
            "total_price": "25.00",
            "status": "confirmed",
            "created_at": "2026-06-22T00:00:00Z"
          }
        ]
      }
    }
    ```

---

### 1.4 Stripe Payment Integrations

#### `POST /api/payments/webhook`
*   **Purpose**: Safe webhook listener handling payment notifications from Stripe to update booking status.
*   **Request Body**: Standard Stripe Webhook Event Payload (Signed).
*   **Response (200 OK)**:
    ```json
    { "received": true }
    ```

---

## 2. Architecture & Concurrency Scalability

### 2.1 Pessimistic Concurrency Seating Control (`SELECT ... FOR UPDATE`)
*   **The Problem**: Multiple users trying to lock the exact same seat layout simultaneously (race condition).
*   **Architectural Solution**: We wrap seat checking and locking inside a single PostgreSQL Transaction. We execute:
    ```sql
    SELECT * FROM show_seats 
    WHERE show_id = $1 AND seat_id = ANY($2) 
    FOR UPDATE;
    ```
    This blocks other transaction threads trying to read/write these rows until the current transaction commits. We evaluate availability and set the locks in milliseconds, minimizing database thread blockage.

### 2.2 Short-Lived Seat Locks
*   Instead of maintaining open WebSockets to hold a seat, which creates memory overhead on our servers, we use stateless REST with an expiration timestamp (`locked_until`). 
*   This shifts state management to database records and uses a lightweight background scheduler to clear expired locks. This structure enables our application servers to remain completely stateless, meaning we can scale horizontally to millions of users by adding more application nodes behind a load balancer (e.g., NGINX).

### 2.3 Stripe Webhook Decoupling
*   When a user clicks "Pay", the request goes directly to Stripe. Our servers are bypassed during the secure checkout.
*   Stripe signals our backend via webhooks. If the server is offline or experiencing heavy load, Stripe retries webhooks automatically (exponential backoff). This ensures high reliability and decouples payment operations from core business requests.

### 2.4 Indexing Optimization
We will create compound indexes to optimize queries run under load:
1.  `CREATE UNIQUE INDEX idx_show_seats_uniq ON show_seats(show_id, seat_id);` (speeds up concurrency checks).
2.  `CREATE INDEX idx_shows_movie_time ON shows(movie_id, start_time);` (optimizes show listing searches).
3.  `CREATE INDEX idx_bookings_user ON bookings(user_id);` (accelerates user booking history lookups).
