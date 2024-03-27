const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "alive" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
