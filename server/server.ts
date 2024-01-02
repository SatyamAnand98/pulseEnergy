import http from "http";
import WebSocket from "ws";
import cluster from "cluster";
import os from "os";

const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`🟢 Master process ${process.pid} is running`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`❌ Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("🟢  New connection");

        ws.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message);
            console.log(
                "✅ Received message: \n",
                "🔌 Charge point ID: ",
                parsedMessage.charge_point_id,
                "\n📦 Raw message:\n",
                JSON.stringify(JSON.parse(parsedMessage.payload), null, 4)
            );
            ws.send(message);
        });

        ws.on("close", () => {
            console.log("🔴 Connection closed");
        });
    });

    server.listen(8080, () => {
        console.log(`🟢 Worker ${process.pid} started`);
    });
}
