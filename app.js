const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res)=>{
    res.render("room", { roomId: req.params.room });
});

io.on("connection", socket => {
    // console.log("new user socket connection");
    socket.on("join-room", (roomId, userId) => {
        console.log("received a request to join the room");
        socket.join(roomId);
        console.log("joined");
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", ()=>{
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});

server.listen(3000, ()=>{
    console.log("server is running on port 3000");
});
