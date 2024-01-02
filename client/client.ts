import WebSocket from "ws";

const serverUrl = "ws://localhost:8080";
const wsClients: Map<number, WebSocket> = new Map();

export const sendToServer = (clientId: number, message: string) => {
    if (!wsClients.has(clientId)) {
        const wsClient = new WebSocket(serverUrl);

        wsClient.on("open", () => {
            console.log(`🟢 Client ${clientId} connected to server`);
            wsClient.send(message);
        });

        wsClient.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message);
            console.log(
                "✅ Received message from server with clientId: ",
                clientId,
                "\n",
                "🔌 Charge point ID: ",
                parsedMessage.charge_point_id,
                "\n📦 Raw message:\n",
                JSON.stringify(JSON.parse(parsedMessage.payload), null, 4)
            );
        });

        wsClient.on("close", () => {
            console.log(`🔴 Client ${clientId} disconnected from server`);
        });

        wsClient.on("error", (err) => {
            console.error(`WebSocket error for client ${clientId}:`, err);
        });

        wsClients.set(clientId, wsClient);
    } else {
        const wsClient = wsClients.get(clientId);
        if (wsClient && wsClient.readyState === WebSocket.OPEN) {
            wsClient.send(message);
        } else {
            console.log(
                `❌ WebSocket for client ${clientId} is not open. Message not sent.`
            );
        }
    }
};
