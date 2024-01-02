import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cluster from "cluster";
import os from "os";
import { saveData } from "../helpers/saveToDb";

if (cluster.isPrimary) {
    console.log(`🟢 Master ${process.pid} is running`);

    const numCPUs = os.cpus().length;
    console.log(`🟢 Forking ${numCPUs} CPUs`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`🔴 Worker ${worker.process.pid} died`);
        console.log("🟢 Starting a new worker");
        cluster.fork();
    });
} else {
    let count_of_clients = 0;
    const httpServer = http.createServer();
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        count_of_clients++;
        console.log(
            `🟢 New connection ${socket.id}, count of clients: ${count_of_clients}`
        );

        socket.on("message", (message) => {
            let parsedMessage = message;
            try {
                if (typeof message !== "object") {
                    parsedMessage = JSON.parse(message);
                }
                socket.emit("onResponse", parsedMessage);
                saveData(parsedMessage.charge_point_id, parsedMessage.payload);
            } catch (error) {
                console.error("⚠️ Error parsing message: ", error);
            }
        });

        socket.on("disconnect", () => {
            count_of_clients--;
            console.log(
                `🔴 Connection with ${socket.id} closed, remaining count of clients: ${count_of_clients}`
            );
        });
    });

    httpServer.listen(3000, () => {
        console.log(`🟢 Worker ${process.pid} started on port 3000`);
    });
}
