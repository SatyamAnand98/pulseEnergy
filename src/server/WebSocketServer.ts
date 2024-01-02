import http from "http";
import WebSocket from "ws";
import cluster from "cluster";
import os from "os";
// import { saveData } from '../helpers/saveToDb';

const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`🟢 Master process ${process.pid} is running`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`❌ Worker ${worker.process.pid} died`);
        console.log("🟢 Starting a new worker");
        console.log("Code: ", code);
        console.log("Signal: ", signal);
        cluster.fork();
    });
} else {
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("🟢 New connection");

        ws.on("message", (message: Buffer) => {
            console.log("Received message type:", typeof message);
            console.log("Received message length:", message.length);
            const messageString = message.toString();
            console.log("Received message: ", messageString);

            if (!messageString) {
                console.log("⚠️ Received an empty message");
                return;
            }

            try {
                const parsedMessage = JSON.parse(messageString);
                console.log("✅ Parsed message: ", parsedMessage);

                // saveData(parsedMessage);

                ws.send(messageString);
            } catch (error) {
                console.error("⚠️ Error parsing message: ", error);
            }
        });

        ws.on("close", () => {
            console.log("🔴 Connection closed");
        });
    });

    server.listen(8080, () => {
        console.log(`🟢 Worker ${process.pid} started`);
    });
}
