import { io } from "socket.io-client";

const serverUrl = "http://localhost:3000";
const socketClients: Map<number, ReturnType<typeof io>> = new Map();

export const sendToServer = (clientId: number, message: string) => {
    if (!socketClients.has(clientId)) {
        const socketClient = io(serverUrl);

        socketClient.on("connect", () => {
            console.log(`🟢 Client ${clientId} connected to server`);
            socketClient.emit("message", message);
        });

        socketClient.on("message", (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                console.log(
                    "✅ Received message from server with clientId: ",
                    clientId,
                    "\n📦 Raw message:\n",
                    parsedMessage
                );
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });

        socketClient.on("disconnect", () => {
            console.log(`🔴 Client ${clientId} disconnected from server`);
        });

        socketClient.on("connect_error", (err) => {
            console.error(`Connection error for client ${clientId}:`, err);
        });

        socketClients.set(clientId, socketClient);
    } else {
        const socketClient = socketClients.get(clientId);
        if (socketClient && socketClient.connected) {
            socketClient.emit("message", message);
        } else {
            console.log(
                `❌ Socket for client ${clientId} is not connected. Message not sent.`
            );
        }
    }
};
