const express = require("express");
const { randomBytes } = require("crypto");

const app = express();

const posts= {};

app.use(express.json());

app.get("/posts", (req, res)=>{
    res.send(posts);
});

app.post("/posts", (req, res)=>{
    const { title } = req.body;
    const id = randomBytes(4).toString("hex");
    posts[id] = { id, title};
    res.status(201).send(posts[id]);
});

app.listen(4000, ()=>{
    console.log("server running on port 4000");
})