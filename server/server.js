require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const fs = require("fs");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const { API } = require("./config/paths");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;

// connect to mongodb
connectDB();

//custom middleware: logger
app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data (form data: content-type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ limit: "50mb", extended: false }));
// built-in middleware for json data: content-type: application/json
app.use(express.json({ limit: "50mb" }));
// built-in middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
//middleware for cookies
app.use(cookieParser());

// routes
app.use("/", require("./routes/root"));
app.use(API.v1.register, require("./routes/register"));
app.use(API.v1.auth, require("./routes/auth"));
app.use(API.v1.refresh, require("./routes/refresh"));
app.use(API.v1.logout, require("./routes/logout"));

app.use(verifyJWT);
app.use(API.v1.employees, require("./routes/api/employees"));
app.use(API.v1.users, require("./routes/api/users"));
app.use(API.v1.patients, require("./routes/api/patients"));
app.use(API.v1.records, require("./routes/api/googleDrive"));

// .all is used for all methods; * is okay because it is at the end of the code
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile("./views/404.html", { root: __dirname });
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
