// 2. Declare collections (shared) here
//    Publications will be declared in server/publications.js
//    Subscriptions will be declared in client/subscriptions.js
// 
// Note that meteor will minify and package all files into a single 
//  app.js and app.cs for deployment. With that in mind, its better
//  to have many files (and clarity of structure) than to put all
//  into a single file with a generalized name

Markers = new Mongo.Collection("markers");