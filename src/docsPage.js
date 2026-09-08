const endpointRows = (rows) =>
  rows
    .map(
      ([method, path, purpose, auth]) =>
        `<tr><td><span class="method ${method.toLowerCase()}">${method}</span></td><td><code>${path}</code></td><td>${purpose}</td><td>${auth}</td></tr>`,
    )
    .join("");

const table = (rows) =>
  `<div class="table-wrap"><table><thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th><th>Auth</th></tr></thead><tbody>${endpointRows(rows)}</tbody></table></div>`;

export default function docsPage() {
  const users = table([
    ["POST", "/users/signup", "Create an account and return a JWT token", "No"],
    ["POST", "/users/signin", "Sign in with email or username", "No"],
    [
      "PATCH",
      "/users/change-password",
      "Change password and return a new token",
      "Yes",
    ],
    [
      "GET",
      "/users/profile-data",
      "Get the current authenticated profile",
      "Yes",
    ],
    [
      "GET",
      "/users/suggestions?page=1&limit=10",
      "Get follow suggestions",
      "Yes",
    ],
    ["GET", "/users", "Get users", "No"],
    ["GET", "/users/:id", "Get one user", "No"],
    ["PUT", "/users/:id", "Update your own profile", "Yes, owner"],
    ["POST", "/users/:id/follow", "Follow a user", "Yes"],
    ["DELETE", "/users/:id/follow", "Unfollow a user", "Yes"],
  ]);
  const posts = table([
    ["GET", "/posts?page=1&limit=10", "Get newest posts", "Yes"],
    ["GET", "/posts/:postId", "Get one post", "Yes"],
    ["POST", "/posts", "Create a post", "Yes"],
    ["PUT", "/posts/:postId", "Update your own post", "Yes, owner"],
    ["DELETE", "/posts/:postId", "Delete your own post", "Yes, owner"],
    ["PUT", "/posts/:postId/like", "Like or unlike a post", "Yes"],
    [
      "GET",
      "/posts/:postId/likes?page=1&limit=10",
      "List users who liked a post",
      "Yes",
    ],
    ["PUT", "/posts/:postId/bookmark", "Bookmark or unbookmark a post", "Yes"],
    ["POST", "/posts/:postId/share", "Share a post", "Yes"],
  ]);
  const comments = table([
    ["GET", "/posts/:postId/comments?page=1&limit=10", "Get comments", "Yes"],
    ["POST", "/posts/:postId/comments", "Add a comment", "Yes"],
    ["GET", "/posts/:postId/comments/:commentId/replies", "Get replies", "Yes"],
    [
      "POST",
      "/posts/:postId/comments/:commentId/replies",
      "Add a reply",
      "Yes",
    ],
    [
      "PUT",
      "/posts/:postId/comments/:commentId",
      "Edit a comment",
      "Yes, owner",
    ],
    [
      "DELETE",
      "/posts/:postId/comments/:commentId",
      "Delete a comment",
      "Yes, owner/post owner",
    ],
    [
      "DELETE",
      "/comments/:id",
      "Delete comment alias",
      "Yes, owner/post owner",
    ],
    [
      "PUT",
      "/posts/:postId/comments/:commentId/like",
      "Like or unlike a comment",
      "Yes",
    ],
  ]);
  const notifications = table([
    ["GET", "/notifications?page=1&limit=10", "Get notifications", "Yes"],
    ["GET", "/notifications/unread-count", "Get unread count", "Yes"],
    [
      "PATCH",
      "/notifications/:notificationId/read",
      "Mark one notification as read",
      "Yes",
    ],
    [
      "PATCH",
      "/notifications/read-all",
      "Mark all notifications as read",
      "Yes",
    ],
  ]);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Eloop Social API Documentation</title>
<style>
:root{--ink:#17211b;--muted:#637068;--paper:#f7f8f3;--panel:#fff;--line:#dce4dc;--green:#157347;--mint:#e4f3e9;--orange:#c66a24;--code:#1c2922}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}a{color:var(--green)}.layout{display:grid;grid-template-columns:270px minmax(0,900px);gap:42px;max-width:1260px;margin:auto;padding:28px 24px}.sidebar{position:sticky;top:24px;height:fit-content}.brand{font-size:25px;font-weight:800;letter-spacing:.02em}.brand span{color:var(--green)}.tag{color:var(--muted);margin:3px 0 24px}.nav{display:grid;gap:6px}.nav a{text-decoration:none;padding:8px 10px;border-radius:6px}.nav a:hover{background:var(--mint)}main{min-width:0}.hero{background:var(--green);color:white;padding:34px;border-radius:12px;margin-bottom:24px}.hero h1{font-size:clamp(30px,5vw,52px);line-height:1.05;margin:0 0 12px}.hero p{max-width:650px;margin:0;color:#e7f4e9}.url{display:inline-block;margin-top:20px;padding:9px 12px;background:#0e5332;border-radius:6px;color:white;font-family:ui-monospace,monospace;font-size:13px;word-break:break-all}.section{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:26px;margin:20px 0}.section h2{margin:0 0 10px;font-size:26px}.section h3{margin-top:25px}.section p{color:#3e4d44}.table-wrap{overflow-x:auto;margin:16px 0}table{width:100%;border-collapse:collapse;min-width:700px}th,td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{background:#f0f5ef;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}code{font:13px ui-monospace,SFMono-Regular,Consolas,monospace;background:#edf2ed;padding:2px 5px;border-radius:4px;white-space:nowrap}.method{font:700 11px ui-monospace,monospace}.get{color:#147548}.post{color:#bd5b16}.put{color:#6d4a9a}.delete{color:#b42d36}.patch{color:#2469a6}.code{background:var(--code);color:#e7f4e9;border-radius:8px;padding:16px;overflow:auto;font:13px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.callout{background:var(--mint);border-left:4px solid var(--green);padding:12px 14px;border-radius:4px}.status{display:inline-block;background:var(--mint);color:var(--green);padding:3px 8px;border-radius:99px;font-weight:700;font-size:12px}@media(max-width:800px){.layout{display:block;padding:16px}.sidebar{position:static;margin-bottom:20px}.nav{display:flex;flex-wrap:wrap}.hero{padding:24px}.section{padding:20px}.grid{grid-template-columns:1fr}}
</style></head>
<body><div class="layout"><aside class="sidebar"><div class="brand"><span>Eloop</span> API</div><p class="tag">Social API documentation</p><nav class="nav"><a href="#start">Quick start</a><a href="#auth">Authentication</a><a href="#users">Users</a><a href="#posts">Posts</a><a href="#comments">Comments</a><a href="#notifications">Notifications</a><a href="#errors">Errors</a><a href="/api/health">API health</a></nav></aside><main>
<section class="hero"><h1>Eloop Social API</h1><p>A simple REST API for authentication, profiles, posts, likes, comments, replies, follows, and notifications.</p><div class="url">Base URL: ${process.env.PUBLIC_API_URL || "https://social-app-backend-6u7v530f9-eloopeg.vercel.app/api"}</div></section>
<section class="section" id="start"><h2>Quick start</h2><p>Use this workflow to test the API in Postman or connect it to a React frontend.</p><div class="grid"><div class="callout"><strong>1. Create an account</strong><br>Use <code>POST /users/signup</code>.</div><div class="callout"><strong>2. Save the token</strong><br>Copy <code>data.token</code> from the response.</div><div class="callout"><strong>3. Authorize requests</strong><br>Send <code>Authorization: Bearer YOUR_TOKEN</code>.</div><div class="callout"><strong>4. Use the social features</strong><br>Create posts, like, comment, and follow.</div></div><h3>Required headers</h3><pre class="code">Authorization: Bearer YOUR_TOKEN
Content-Type: application/json</pre></section>
<section class="section" id="auth"><h2>Authentication</h2>${users}<h3>Sign up</h3><pre class="code">POST /api/users/signup

{
  "name": "Ahmed Test",
  "username": "ahmedtest123",
  "email": "ahmedtest123@example.com",
  "password": "Test123456"
}</pre><h3>Sign in</h3><pre class="code">POST /api/users/signin

{
  "login": "ahmedtest123",
  "password": "Test123456"
}</pre><p>The password must contain at least 6 characters. Passwords are hashed and never returned.</p></section>
<section class="section" id="users"><h2>Users</h2><p>Users can view profiles, update their own profile, and follow or unfollow other users. Profile updates are owner-only.</p><pre class="code">PUT /api/users/USER_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Ahmed",
  "bio": "Software developer",
  "image": "https://example.com/avatar.jpg"
}</pre></section>
<section class="section" id="posts"><h2>Posts</h2>${posts}<h3>Create a post</h3><pre class="code">POST /api/posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "body": "Hello from Eloop",
  "image": "https://example.com/image.jpg"
}</pre><p>A post must contain text, an image URL, or both. Only the owner can update or delete a post. Like and bookmark endpoints toggle their state.</p><h3>Like response</h3><pre class="code">{
  "success": true,
  "message": "success",
  "data": { "liked": true, "likesCount": 5 },
  "meta": {}
}</pre></section>
<section class="section" id="comments"><h2>Comments and replies</h2>${comments}<h3>Add a comment</h3><pre class="code">POST /api/posts/POST_ID/comments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{ "content": "Great post!" }</pre><h3>Add a reply</h3><pre class="code">POST /api/posts/POST_ID/comments/COMMENT_ID/replies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{ "content": "Thank you!" }</pre></section>
<section class="section" id="notifications"><h2>Notifications</h2>${notifications}</section>
<section class="section" id="errors"><h2>Response and errors</h2><h3>Success</h3><pre class="code">{ "success": true, "message": "success", "data": {}, "meta": {} }</pre><h3>Error</h3><pre class="code">{ "success": false, "message": "Error message" }</pre><p><span class="status">400</span> Invalid data &nbsp; <span class="status">401</span> Invalid token &nbsp; <span class="status">403</span> Not allowed &nbsp; <span class="status">404</span> Not found &nbsp; <span class="status">409</span> Duplicate data &nbsp; <span class="status">503</span> Database unavailable</p></section>
<footer class="section"><strong>Eloop Social API</strong><p>Built for simple integration with React and Postman.</p></footer>
</main></div></body></html>`;
}
