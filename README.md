### API Documentation

#### Base URL

The base URL for all endpoints is `/api/v1`.

#### Endpoints

##### Authentication

- `POST /api/v1/login`

  - **Description:** Log in with registered credentials.
  - **Request Body:**
    - `email`: String (required)
    - `password`: String (required)
  - **Response:**
    - `token`: Authentication token

- `POST /api/v1/signup`

  - **Description:** Register a new user.
  - **Request Body:**
    - `email`: String (required)
    - `password`: String (required)
  - **Response:**
    - `token`: Authentication token

- `POST /api/v1/forgot-password`

  - **Description:** Request to reset forgotten password.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

- `POST /api/v1/reset-password/:token`
  - **Description:** Reset password with token received via email.
  - **Request Body:**
    - `password`: String (required)
  - **Response:** Success message

##### User Management

- `GET /api/v1/users`
  - **Description:** Get all users (requires authentication).
  - **Response:** Array of user objects

##### Group Management

- `GET /api/v1/groups`

  - **Description:** Get all groups (requires authentication).
  - **Response:** Array of group objects

- `GET /api/v1/groups/:id`

  - **Description:** Get a single group by ID (requires authentication).
  - **Response:** Group object

- `POST /api/v1/groups`

  - **Description:** Create a new group (requires authentication).
  - **Request Body:**
    - `name`: String (required)
    - `description`: String
  - **Response:** Created group object

- `PUT /api/v1/groups/:id`

  - **Description:** Update an existing group (requires authentication).
  - **Request Body:**
    - `name`: String
    - `description`: String
  - **Response:** Updated group object

- `DELETE /api/v1/groups/:id`
  - **Description:** Delete a group by ID (requires authentication).
  - **Response:** Success message

##### Member Management

- `GET /api/v1/members`

  - **Description:** Get all members.
  - **Response:** Array of member objects

- `GET /api/v1/members/:id`

  - **Description:** Get a single member by ID (requires authentication).
  - **Response:** Member object

- `POST /api/v1/members`

  - **Description:** Create a new member (requires authentication).
  - **Request Body:**
    - `name`: String (required)
    - `email`: String
    - `phone`: String
  - **Response:** Created member object

- `PUT /api/v1/members/:id`

  - **Description:** Update an existing member (requires authentication).
  - **Request Body:**
    - `name`: String
    - `email`: String
    - `phone`: String
  - **Response:** Updated member object

- `DELETE /api/v1/members/:id`
  - **Description:** Delete a member by ID (requires authentication).
  - **Response:** Success message

##### Ballot Management

- `GET /api/v1/ballots`

  - **Description:** Get user's ballot status (requires authentication).
  - **Response:** Ballot status object

- `GET /api/v1/ballots/all`

  - **Description:** Get all ballots (requires authentication).
  - **Response:** Array of ballot objects

- `POST /api/v1/ballots`

  - **Description:** Create a new ballot (requires authentication).
  - **Request Body:**
    - `groupId`: String (required)
  - **Response:** Created ballot object

- `POST /api/v1/ballots/ranks`
  - **Description:** Get ranks for a specific ballot (requires authentication).
  - **Request Body:**
    - `ballotId`: String (required)
  - **Response:** Array of rank objects

##### Contact

- `POST /api/v1/contact`
  - **Description:** Send a contact message.
  - **Request Body:**
    - `name`: String (required)
    - `email`: String (required)
    - `message`: String (required)
  - **Response:** Success message

##### OTP

- `POST /api/v1/send-otp`

  - **Description:** Send OTP for verification.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

- `POST /api/v1/sendotp`
  - **Description:** Send OTP for verification.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

---

**Author:** Kum Jude Bama  
**Email:** kumjude09@gmail.com  
**LinkedIn:** [Kum Jude Bama](https://www.linkedin.com/in/kum-jude-bama-b73645226/)  
**Twitter:** [Kum Jude Bama](https://twitter.com/kumjudebama)
