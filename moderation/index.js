const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const status = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:4005/events",{
        type: "CommentModerated",
        data: {id, content, status, postId}
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("App listening on port 4003");
});
