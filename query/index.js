const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    //console.log({ query: "comment update" });
    const { id, content, postId, status } = data;
    const updatedComment = posts[postId].comments.find(
      (comment) => comment.id === id
    );
    updatedComment.content = content;
    updatedComment.status = status;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("server running on port 4002");
  const res = await axios.get("http://event-bus-srv:4005/events");
  let event;
  for (event of res.data) {
    handleEvents(event.type, event.data);
  }
});
