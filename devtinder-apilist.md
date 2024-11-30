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
 * GET /user/connection/list - Get connection list 🔍
 * GET /user/connection/list/pending - Get pending connections 🔍
 * GET /user/connection/list/accepted - Get accepted connections 🔍
 * GET /user/connection/list/rejected - Get rejected connections 🔍
 * GET /user/connection/list/ignored - Get ignored connections 🔍
 * GET /user/connection/list/search - Search connections 🔍
 * GET /user/connection/list/filter - Filter connections 🔍
 * GET /user/connection/list/sort - Sort connections 🔍
 

 
 * GET /user/requests/received - Get received requests 🔍

 * GET /feed - Get you the profiles of the people you might like 🔍



status : ignore , interested , accepted , rejected
#ConnectionRequestSchema

    fromUserId :: mongosse.schema.Types.ObjectId,
    toUserId  :: mongosse.schema.Types.ObjectId,
    status :: string , [enum : ignore , interested , accepted , rejected],
    createdAt :: Date,  
    updatedAt :: Date   

    - Create connnection request schema 
    send connectioon to request api
    -proper validation of data
    -think about all corner
    -$or and other query
    -pre in mongoose
    -post in mongoose
    -error handling
    -api doc
    -learn about index