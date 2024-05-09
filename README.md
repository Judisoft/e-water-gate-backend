### Ballot App API Documentation

##### Environment Variables

Make sure to include your own credentials for the following environmental variables in your `.env` file:

- `MONGODB_URL`: MongoDB connection URL. Example: `mongodb+srv://username:password@your-cluster.mongodb.net/your-database`
- `PORT`: Port number for the server to listen on. Example: `5000`
- `JWT_EXP`: JWT token expiration time.
- `MAIL_HOST`: Hostname for sending emails.
- `MAIL_USER`: Email address used for sending emails.
- `MAIL_PASS`: Password for the email account.
- `MAIL_SENDER`: Sender's name for outgoing emails.

#### Base URL

The base URL for all endpoints is `/api/v1`.

#### Endpoints

##### Authentication

- `POST /login`

  - **Description:** Log in with registered credentials.
  - **Request Body:**
    - `email`: String (required)
    - `password`: String (required)
  - **Response:**
    - `token`: Authentication token

- `POST /signup`

  - **Description:** Register a new user.
  - **Request Body:**
    - `email`: String (required)
    - `password`: String (required)
  - **Response:**
    - `token`: Authentication token

- `POST /forgot-password`

  - **Description:** Request to reset forgotten password.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

- `POST /reset-password/:token`
  - **Description:** Reset password with token received via email.
  - **Request Body:**
    - `password`: String (required)
  - **Response:** Success message

##### User Management

- `GET /users`
  - **Description:** Get all users (requires authentication).
  - **Response:** Array of user objects

##### Group Management

- `GET /groups`

  - **Description:** Get all groups (requires authentication).
  - **Response:** Array of group objects

- `GET /groups/:id`

  - **Description:** Get a single group by ID (requires authentication).
  - **Response:** Group object

- `POST /groups`

  - **Description:** Create a new group (requires authentication).
  - **Request Body:**
    - `name`: String (required)
    - `description`: String
  - **Response:** Created group object

- `PUT /groups/:id`

  - **Description:** Update an existing group (requires authentication).
  - **Request Body:**
    - `name`: String
    - `description`: String
  - **Response:** Updated group object

- `DELETE /groups/:id`
  - **Description:** Delete a group by ID (requires authentication).
  - **Response:** Success message

##### Member Management

- `GET /members`

  - **Description:** Get all members.
  - **Response:** Array of member objects

- `GET /members/:id`

  - **Description:** Get a single member by ID (requires authentication).
  - **Response:** Member object

- `POST /members`

  - **Description:** Create a new member (requires authentication).
  - **Request Body:**
    - `name`: String (required)
    - `email`: String
    - `phone`: String
  - **Response:** Created member object

- `PUT /members/:id`

  - **Description:** Update an existing member (requires authentication).
  - **Request Body:**
    - `name`: String
    - `email`: String
    - `phone`: String
  - **Response:** Updated member object

- `DELETE /members/:id`
  - **Description:** Delete a member by ID (requires authentication).
  - **Response:** Success message

##### Ballot Management

- `GET /ballots`

  - **Description:** Get user's ballot status (requires authentication).
  - **Response:** Ballot status object

- `GET /ballots/all`

  - **Description:** Get all ballots (requires authentication).
  - **Response:** Array of ballot objects

- `POST /ballots`

  - **Description:** Create a new ballot (requires authentication).
  - **Request Body:**
    - `groupId`: String (required)
  - **Response:** Created ballot object

- `POST /ballots/ranks`
  - **Description:** Get ranks for a specific ballot (requires authentication).
  - **Request Body:**
    - `ballotId`: String (required)
  - **Response:** Array of rank objects

##### Contact

- `POST /contact`
  - **Description:** Send a contact message.
  - **Request Body:**
    - `name`: String (required)
    - `email`: String (required)
    - `message`: String (required)
  - **Response:** Success message

##### OTP

- `POST /send-otp`

  - **Description:** Send OTP for verification.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

- `POST /sendotp`
  - **Description:** Send OTP for verification.
  - **Request Body:**
    - `email`: String (required)
  - **Response:** Success message

---

**Author:** Kum Jude Bama  
**Email:** kumjude09@gmail.com  
**LinkedIn:** [Kum Jude Bama](https://www.linkedin.com/in/kum-jude-bama-b73645226/)  
**Twitter:** [Kum Jude Bama](https://twitter.com/kumjudebama)
