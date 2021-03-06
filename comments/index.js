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
  comments.push({ id, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { id, content, postId: req.params.id, status: "pending" },
  });

  res.status(201).send(comments);
});

app.post("/events",async (req, res) => {
  console.log("Event recieved  comments" + req.body.type);
  const {type, data} = req.body;
  if(type === "CommentModerated"){
    const {id, postId, content, status} = data;
    const comments = commentsByPostId[postId];
    const updatedComment = comments.find(comment=> comment.id === id);
    updatedComment.status = status;

    await axios.post("http://event-bus-srv:4005/events",{
      type: "CommentUpdated",
      data: {id, postId, content, status }
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("server running on port 4001");
});
