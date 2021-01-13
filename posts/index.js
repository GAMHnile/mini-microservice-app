const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const posts = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };
  axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req,res)=>{
    console.log("Event recieved " + req.body.type);
    res.send({});
})

app.listen(4000, () => {
  console.log("server running on port 4000");
});
