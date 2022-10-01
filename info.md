### difference between realtime chatting app and video conferencing app
In a simple chatting web app, when two browsers need to send messages to each other, they typically need a server in between for coordination and passing the messages. But having a server in the middle results in a delay in communication between the browsers. This delay hardly affects the utility of the chatting app. Even if this delay is (say) 5 secs, we would still be able to use this chatting application.

However, in the case of a video conferencing application, this delay is significant. It will be extremely difficult to talk to someone using such an application. Imagine yourself talking to someone who receives your voice 5 secs later. You can realize how annoying it will be.

Hence, for video conferencing, we require Real-Time Communication between the browsers. Such communication is possible if we eliminate the server from between. This is why we will have to use WebRTC — an open-source framework providing web browsers and mobile applications with real-time communication via simple APIs.
