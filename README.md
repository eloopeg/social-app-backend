# Eloop Social API

Beginner-friendly REST API for a social application, compatible with the Route Academy `route-posts` workflow.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

The local base URL is `http://localhost:5000/api`.

## Environment

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eloop_social
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Create a free MongoDB Atlas cluster, create a database user, allow the development IP address, and copy its connection string into `MONGO_URI`. Never commit `.env`.

## Authentication

Register with `POST /users/signup` or sign in with `POST /users/signin`. Use the returned `data.token` on protected requests:

```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

The Eloop aliases `POST /auth/register` and `POST /auth/login` are also available.

## Response format

Success responses use `{ "success": true, "message": "success", "data": {}, "meta": {} }`.
Errors use `{ "success": false, "message": "...", "errors": [] }` when validation details exist.

## Endpoints

### Health

`GET /health` is public and returns `{ "success": true, "message": "Eloop API is running" }`.

### Users and authentication

| Method | Path                                 | Auth       |
| ------ | ------------------------------------ | ---------- |
| POST   | `/users/signup`                      | No         |
| POST   | `/users/signin`                      | No         |
| PATCH  | `/users/change-password`             | Yes        |
| GET    | `/users/profile-data`                | Yes        |
| GET    | `/users/suggestions?page=1&limit=10` | Yes        |
| GET    | `/users`                             | No         |
| GET    | `/users/:id`                         | No         |
| PUT    | `/users/:id`                         | Yes, owner |
| POST   | `/users/:id/follow`                  | Yes        |
| DELETE | `/users/:id/follow`                  | Yes        |

Signup body: `{ "name": "Ada Lovelace", "username": "ada", "email": "ada@example.com", "password": "secret123" }`.

Signin body: `{ "login": "ada", "password": "secret123" }`.

Profile update body: `{ "name": "Ada", "bio": "Engineer", "image": "https://example.com/avatar.jpg" }`.

### Posts

| Method | Path                                   | Auth       |
| ------ | -------------------------------------- | ---------- |
| GET    | `/posts`                               | Yes        |
| GET    | `/posts/:postId`                       | Yes        |
| POST   | `/posts`                               | Yes        |
| PUT    | `/posts/:postId`                       | Yes, owner |
| PUT    | `/posts/:postId/like`                  | Yes        |
| GET    | `/posts/:postId/likes?page=1&limit=10` | Yes        |
| PUT    | `/posts/:postId/bookmark`              | Yes        |
| POST   | `/posts/:postId/share`                 | Yes        |
| DELETE | `/posts/:postId`                       | Yes, owner |

Create body: `{ "body": "Hello from Eloop", "image": "" }`. A post needs text, an image, or both. Like and bookmark endpoints toggle state and are duplicate-safe.

### Comments and replies

| Method | Path                                         | Auth                  |
| ------ | -------------------------------------------- | --------------------- |
| GET    | `/posts/:postId/comments?page=1&limit=10`    | Yes                   |
| POST   | `/posts/:postId/comments`                    | Yes                   |
| GET    | `/posts/:postId/comments/:commentId/replies` | Yes                   |
| POST   | `/posts/:postId/comments/:commentId/replies` | Yes                   |
| PUT    | `/posts/:postId/comments/:commentId`         | Yes, owner            |
| DELETE | `/posts/:postId/comments/:commentId`         | Yes, owner/post owner |
| PUT    | `/posts/:postId/comments/:commentId/like`    | Yes                   |
| DELETE | `/comments/:id`                              | Yes, owner            |

Comment body: `{ "content": "Great post!" }`. A reply uses the same body and is linked to the parent comment.

### Notifications

| Method | Path                                  | Auth |
| ------ | ------------------------------------- | ---- |
| GET    | `/notifications?page=1&limit=10`      | Yes  |
| GET    | `/notifications/unread-count`         | Yes  |
| PATCH  | `/notifications/:notificationId/read` | Yes  |
| PATCH  | `/notifications/read-all`             | Yes  |

## Deployment

`render.yaml` is ready for a Render free web service. Create a service from this repository and set the secret `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` environment variables in Render. The public base URL will be:

`https://eloop-social-api.onrender.com/api`

Render and MongoDB Atlas accounts are external services, so the final public deployment cannot be created from this workspace without account access and credentials.
