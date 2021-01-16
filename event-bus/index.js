const express = require("express");
const axios = require("axios");

const app = express();

const events = [];

app.use(express.json());

app.get("/events", (req,res)=>{
    res.send(events);
});

app.post("/events", (req, res)=>{
    const event = req.body;
    axios.post("http://localhost:4000/events", event);
    axios.post("http://localhost:4001/events", event);
    axios.post("http://localhost:4002/events", event);
    axios.post("http://localhost:4003/events", event);

    events.push(event);

    res.send({status: "ok"})
})

app.listen(4005, ()=>{
    console.log("Server listening on port 4005");
})