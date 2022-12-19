require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");
const path = require('path');


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// ========== MIDDLEWARE =============
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
// ^ this is the line that tells our app to look inside the public folder for all static assets like images or css files 



app.use(
  session({
    secret: '123secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/music-app-backend2'
    })
  })
);

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));


// =================== ROUTES ====================

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

const songRoutes = require("./routes/songs.routes");
app.use("/songs", songRoutes);

const videoRoutes = require("./routes/videos.routes");
app.use("/videos", videoRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
