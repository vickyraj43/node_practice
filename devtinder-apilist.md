# Devtinder API List

 => authRouter
 * Post /signup - Register a new user 📝
 * Post /login - Login existing user 🔑
 * Get /logout - Logout user 🔑
=> ProfileRouter
 * GET /profile/view - View profile 🔍
 * PATCH /profile/edit - Edit profile 📝
 * DELETE /profile/delete - Delete profile ❌
 * PATCH /profile/password - Change password 🔑

=> ConnectionRequestRouter
 * POST /request/send/interested - Send interested request 🔍
 * POST /request/send/ignored - Send accepted request 🔍
 * POST /request/review/accepted - Accept request 🔍
 * POST /request/review/rejected - Reject request 🔍

=> UserRouter
 * GET /user/connection/list - Get connection list 🔍
 * GET /user/requests/received - Get received requests 🔍

 * GET /feed - Get you the profiles of the people you might like 🔍

status : ignore , interested , accepted , rejected