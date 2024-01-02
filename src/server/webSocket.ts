import http from "http";
import { Server as SocketIOServer } from "socket.io";
// import { saveData } from '../helpers/saveToDb';

const httpServer = http.createServer();
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`🟢 New connection ${socket.id}`);

    socket.on("message", (message) => {
        console.log("Received message: ", message);

        if (!message) {
            console.log("⚠️ Received an empty message");
        }

        try {
            if (typeof message === "object") {
                const parsedMessage = JSON.parse(message);
                console.log("✅ Parsed message: ", parsedMessage);

                // saveData(parsedMessage);

                socket.emit("onResponse", message);
            }
        } catch (error) {
            console.error("⚠️ Error parsing message: ", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔴 Connection with ${socket.id} closed`);
    });
});

httpServer.listen(3000, () => {
    console.log(`🟢 Worker ${process.pid} started on port 3000`);
});
