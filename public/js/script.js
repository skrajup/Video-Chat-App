const socket = io(); // setup socket connection
const videoFlex = document.querySelector("#video-flex");
const msgForm = document.querySelector(".input-msg > form");
const msgTable = document.querySelector(".msg-table");
const chatWindow = document.querySelector(".chat-window");

var MyVideoStream;
const peers = {};
socket.on("user-connected", userId => {
    console.log("user socket connected: " + userId);
    connectToNewUser(userId);
});

socket.on("user-disconnected", userId => {
    if(peers[userId]) peers[userId].close();
});

// register with the peer server
const myPeer = new Peer(undefined, {
    host: "/",
    port: "3000",
    path: '/peerjs'
});

myPeer.on("open", id => {
    console.log("my peer id is " + id);
    socket.emit("join-room", ROOM_ID, id);
});

// Handle incoming data connection
myPeer.on('connection', (conn) => {
    console.log('incoming peer connection!');
    conn.on('data', (data) => {
      console.log(`received: ${data}`);
    });
    conn.on('open', () => {
      conn.send('hello!');
    });
});

const myVideo = document.createElement("video");
myVideo.muted = true;// we dont wanna listen to our video

// connect my video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    MyVideoStream = stream;
    addVideoStream(myVideo, stream);
}).catch((err)=>{console.log("error in connecting my video");});

// handling incoming video connection
myPeer.on("call", call => {
    console.log("got a call from " + call);
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream => {
            console.log("received stream from caller");
            addVideoStream(video, userVideoStream);
        });
    }).catch(err=>{
        console.log("error in getting video stream");
    }); 
});


function connectToNewUser(userId) {  
    console.log("video connecting to " + userId);
    // send my stream to that userId
    const conn = myPeer.connect(userId);
    conn.on('data', (data) => {
        console.log(`received: ${data}`);
    });
    conn.on("open", ()=>{
        conn.send("Hii");
    });

    // initiate a connection to the user, who is trying to connect to the room
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        const call = myPeer.call(userId, stream);
        const video = document.createElement("video");
        // now receive their stream and add that to our grid
        call.on("stream", userVideoStream => {
            console.log("stream received back from " + userId);
            addVideoStream(video, userVideoStream);
        });

        call.on("close", () => {
            console.log("User left the call " + userId);
            video.remove();
        });

        peers[userId] = call;
    }).catch(err=>{
        console.log("error in getting video stream");
    }); 
}

function addVideoStream(video, stream) {  
    video.srcObject = stream;
    // once the video is loaded on tha page, we play that video
    video.addEventListener("loadedmetadata", ()=>{
        video.play();
    });

    videoFlex.append(video);
    console.log("video added to the screen");
}

const muteUnmute = () => {  
    const enabled = MyVideoStream.getAudioTracks()[0].enabled;
    MyVideoStream.getAudioTracks()[0].enabled = !enabled;
    (enabled) ? setUnmuteButton() : setMuteButton();
}

const stopVideo = () =>{
    const enabled = MyVideoStream.getVideoTracks()[0].enabled;
    MyVideoStream.getVideoTracks()[0].enabled = !enabled;
    (enabled) ? setStopButton() : setStartButton();
} 

function setUnmuteButton() {  
    document.querySelector(".microphone-btn").innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
    document.querySelector(".microphone-btn").style.backgroundColor = "#c5221f";
}

function setMuteButton() {  
    document.querySelector(".microphone-btn").innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    document.querySelector(".microphone-btn").style.backgroundColor = "#3c4043";
}

const setStopButton = () => {
    document.querySelector(".video-btn").innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
    document.querySelector(".video-btn").style.backgroundColor = "#c5221f";
}

const setStartButton = () => {
    document.querySelector(".video-btn").innerHTML = `<i class="fa-solid fa-video"></i>`;
    document.querySelector(".video-btn").style.backgroundColor = "#3c4043";
}

// in call messages feature implement
msgForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const message = msgForm.input__msg.value;
    socket.emit("message", message);
});

socket.on("newMessage", message => {
    msgTable.innerHTML += `<li>someone said: ${message}</li>`;
    scrollToBottom();
    msgForm.reset();
});

// // scroll to bottom for messages
// const msgTable = document.querySelector(".msg-table");
function scrollToBottom() {  
    chatWindow.scrollTop = chatWindow.scrollHeight;
}