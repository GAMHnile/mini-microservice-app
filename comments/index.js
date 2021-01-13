const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const { content } = req.body;
  const id = randomBytes(4).toString("hex");
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content });
  commentsByPostId[req.params.id] = comments;

  axios.post("http://localhost:4005/events",{
    type: "CommentCreated",
    data: {id, content, postId: req.params.id}

  })

  res.status(201).send(comments);
});

app.post("/events", (req,res)=>{
  console.log("Event recieved " + req.body.type);
  res.send({});
})

app.listen(4001, () => {
  console.log("server running on port 4001");
});
