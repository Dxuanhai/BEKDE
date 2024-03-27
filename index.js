const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./src/routes"));

// app.use((req, res, next) => {
//   const error = new Error("not found");
//   error.status = 404;
//   next(error);
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
