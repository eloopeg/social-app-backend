# Eloop Social API Documentation

A simple social media REST API for the Eloop application.

This documentation follows the same practical style as the Route Academy social API documentation, but every endpoint below belongs to the Eloop API.

## Base URLs

### Local

```text
http://localhost:5000/api
```

### Production

```text
https://social-app-backend-6u7v530f9-eloopeg.vercel.app/api
```

## Quick Start

1. Create an account with `POST /users/signup`.
2. Sign in with `POST /users/signin` when needed.
3. Save the token from `data.token`.
4. Send the token with protected requests:

```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

5. Create a post, interact with it, and add comments.

## Response Contract

All successful responses use this shape:

```json
{
  "success": true,
  "message": "success",
  "data": {},
  "meta": {}
}
```

Error responses use this shape:

```json
{
  "success": false,
  "message": "Error message"
}
```

Paginated endpoints include values such as `page` and `limit` inside `meta`.

## Authentication

Protected endpoints require a valid JWT:

```http
Authorization: Bearer YOUR_TOKEN
```

Do not send the password after registration or login. Passwords are hashed with bcryptjs and are never returned in user responses.

## API Modules

- [Health](#health)
- [Authentication](#authentication)
- [Users](#users)
- [Posts](#posts)
- [Comments and Replies](#comments-and-replies)
- [Notifications](#notifications)

---

## Health

The health endpoint is public and does not require a token.

| Method | Endpoint  | Purpose                                | Auth |
| ------ | --------- | -------------------------------------- | ---- |
| GET    | `/health` | Check whether the Eloop API is running | No   |

### Example

```http
GET /api/health
```

### Response

```json
{
  "success": true,
  "message": "Eloop API is running"
}
```

---

## Authentication

### Endpoint Summary

| Method | Endpoint                 | Purpose                                | Auth |
| ------ | ------------------------ | -------------------------------------- | ---- |
| POST   | `/users/signup`          | Create a user and return a JWT token   | No   |
| POST   | `/users/signin`          | Sign in with email or username         | No   |
| POST   | `/auth/register`         | Alias for signup                       | No   |
| POST   | `/auth/login`            | Alias for signin                       | No   |
| PATCH  | `/users/change-password` | Change password and return a new token | Yes  |

### Sign Up

```http
POST /api/users/signup
Content-Type: application/json
```

```json
{
  "name": "Ahmed Test",
  "username": "ahmedtest123",
  "email": "ahmedtest123@example.com",
  "password": "Test123456"
}
```

The password must contain at least 6 characters. A successful response returns the token in `data.token`.

```json
{
  "success": true,
  "message": "Account created",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "name": "Ahmed Test",
      "username": "ahmedtest123",
      "email": "ahmedtest123@example.com",
      "bio": "",
      "image": "",
      "followers": [],
      "following": []
    }
  },
  "meta": {}
}
```

### Sign In

```http
POST /api/users/signin
Content-Type: application/json
```

You can use a username or email in `login`:

```json
{
  "login": "ahmedtest123",
  "password": "Test123456"
}
```

You can also send `email` or `username` instead of `login`.

### Change Password

```http
PATCH /api/users/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "currentPassword": "Test123456",
  "newPassword": "NewTest123456"
}
```

The response contains a new token. Use the new token for future requests.

---

## Users

### Endpoint Summary

| Method | Endpoint                             | Purpose                            | Auth            |
| ------ | ------------------------------------ | ---------------------------------- | --------------- |
| GET    | `/users`                             | Get users with pagination          | No              |
| GET    | `/users/:id`                         | Get one user                       | No              |
| GET    | `/users/profile-data`                | Get the current authenticated user | Yes             |
| GET    | `/users/suggestions?page=1&limit=10` | Get follow suggestions             | Yes             |
| PUT    | `/users/:id`                         | Update your own profile            | Yes, owner only |
| POST   | `/users/:id/follow`                  | Follow a user                      | Yes             |
| DELETE | `/users/:id/follow`                  | Unfollow a user                    | Yes             |

### Get Users

```http
GET /api/users?page=1&limit=10
```

### Get One User

```http
GET /api/users/USER_ID
```

### Get Current Profile

```http
GET /api/users/profile-data
Authorization: Bearer YOUR_TOKEN
```

### Update Profile

A user can update only their own profile.

```http
PUT /api/users/USER_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "name": "Ahmed",
  "bio": "Software developer",
  "image": "https://example.com/avatar.jpg"
}
```

### Follow and Unfollow

```http
POST /api/users/USER_ID/follow
Authorization: Bearer YOUR_TOKEN
```

```http
DELETE /api/users/USER_ID/follow
Authorization: Bearer YOUR_TOKEN
```

Follow response:

```json
{
  "success": true,
  "message": "success",
  "data": {
    "following": true
  },
  "meta": {}
}
```

A user cannot follow themselves. Follow and follower arrays do not contain duplicate IDs.

---

## Posts

### Endpoint Summary

| Method | Endpoint                               | Purpose                    | Auth            |
| ------ | -------------------------------------- | -------------------------- | --------------- |
| GET    | `/posts?page=1&limit=10`               | Get newest posts           | Yes             |
| GET    | `/posts/:postId`                       | Get one post               | Yes             |
| POST   | `/posts`                               | Create a post              | Yes             |
| PUT    | `/posts/:postId`                       | Update your own post       | Yes, owner only |
| DELETE | `/posts/:postId`                       | Delete your own post       | Yes, owner only |
| PUT    | `/posts/:postId/like`                  | Toggle post like           | Yes             |
| GET    | `/posts/:postId/likes?page=1&limit=10` | Get users who liked a post | Yes             |
| PUT    | `/posts/:postId/bookmark`              | Toggle bookmark            | Yes             |
| POST   | `/posts/:postId/share`                 | Create a shared post       | Yes             |

### Create Post

A post must contain text, an image URL, or both.

```http
POST /api/posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "body": "Hello from Eloop",
  "image": "https://example.com/post-image.jpg"
}
```

`content` can be used instead of `body`:

```json
{
  "content": "Hello from Eloop"
}
```

### Get Posts

```http
GET /api/posts?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

Each post includes basic author information through Mongoose populate.

### Update and Delete a Post

Only the post owner can update or delete it.

```http
PUT /api/posts/POST_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "body": "Updated post text",
  "image": ""
}
```

```http
DELETE /api/posts/POST_ID
Authorization: Bearer YOUR_TOKEN
```

### Like a Post

The like endpoint toggles the current user's like. Calling it once likes the post; calling it again unlikes it.

```http
PUT /api/posts/POST_ID/like
Authorization: Bearer YOUR_TOKEN
```

```json
{
  "success": true,
  "message": "success",
  "data": {
    "liked": true,
    "likesCount": 5
  },
  "meta": {}
}
```

### Bookmark and Share

```http
PUT /api/posts/POST_ID/bookmark
Authorization: Bearer YOUR_TOKEN
```

```http
POST /api/posts/POST_ID/share
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Optional share body:

```json
{
  "body": "Sharing this post"
}
```

---

## Comments and Replies

### Endpoint Summary

| Method | Endpoint                                     | Purpose              | Auth                    |
| ------ | -------------------------------------------- | -------------------- | ----------------------- |
| GET    | `/posts/:postId/comments?page=1&limit=10`    | Get post comments    | Yes                     |
| POST   | `/posts/:postId/comments`                    | Add a comment        | Yes                     |
| GET    | `/posts/:postId/comments/:commentId/replies` | Get replies          | Yes                     |
| POST   | `/posts/:postId/comments/:commentId/replies` | Add a reply          | Yes                     |
| PUT    | `/posts/:postId/comments/:commentId`         | Edit your comment    | Yes, owner only         |
| DELETE | `/posts/:postId/comments/:commentId`         | Delete a comment     | Yes, comment/post owner |
| DELETE | `/comments/:id`                              | Delete comment alias | Yes, comment/post owner |
| PUT    | `/posts/:postId/comments/:commentId/like`    | Toggle comment like  | Yes                     |

### Add Comment

```http
POST /api/posts/POST_ID/comments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "content": "Great post!"
}
```

### Get Comments

```http
GET /api/posts/POST_ID/comments?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### Add Reply

```http
POST /api/posts/POST_ID/comments/COMMENT_ID/replies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "content": "Thank you!"
}
```

### Edit and Delete Comment

```http
PUT /api/posts/POST_ID/comments/COMMENT_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "content": "Updated comment"
}
```

```http
DELETE /api/posts/POST_ID/comments/COMMENT_ID
Authorization: Bearer YOUR_TOKEN
```

A comment owner can delete their comment. The post owner can also delete comments on their post.

---

## Notifications

Notifications are protected and belong to the current user.

| Method | Endpoint                              | Purpose           | Auth |
| ------ | ------------------------------------- | ----------------- | ---- |
| GET    | `/notifications?page=1&limit=10`      | Get notifications | Yes  |
| GET    | `/notifications/unread-count`         | Get unread count  | Yes  |
| PATCH  | `/notifications/:notificationId/read` | Mark one as read  | Yes  |
| PATCH  | `/notifications/read-all`             | Mark all as read  | Yes  |

### Examples

```http
GET /api/notifications?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

```http
GET /api/notifications/unread-count
Authorization: Bearer YOUR_TOKEN
```

```http
PATCH /api/notifications/NOTIFICATION_ID/read
Authorization: Bearer YOUR_TOKEN
```

```http
PATCH /api/notifications/read-all
Authorization: Bearer YOUR_TOKEN
```

---

## Common Errors

| Status | Meaning                                     |
| ------ | ------------------------------------------- |
| 400    | Invalid or missing request data             |
| 401    | Missing, invalid, or expired JWT            |
| 403    | User is not allowed to modify this resource |
| 404    | Resource was not found                      |
| 409    | Email or username already exists            |
| 503    | MongoDB is unavailable or not configured    |

Example:

```json
{
  "success": false,
  "message": "Only the post owner can delete it"
}
```

## Postman

Import the collection from:

```text
postman/Eloop-Social-API.postman_collection.json
```

Set `baseUrl` to either:

```text
http://localhost:5000/api
```

or:

```text
https://social-app-backend-6u7v530f9-eloopeg.vercel.app/api
```

After signup or signin, copy `data.token` into the collection variable `token`.

## Deployment Notes

For Vercel, add these environment variables for the Production environment:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/eloop_social
JWT_SECRET=your-long-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=*
```

MongoDB Atlas must allow Vercel connections through Network Access. For a simple free setup, add `0.0.0.0/0` in Atlas Network Access. Disable Vercel Authentication if the API must be public.
