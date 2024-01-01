import WebSocket from "ws";

let ws: WebSocket;
const serverUrl = "ws://localhost:8080";

function connectWebSocket() {
    ws = new WebSocket(serverUrl);

    ws.on("open", () => {
        console.log("🟢 Connected to server");
    });

    ws.on("close", () => {
        console.log("🔴 Disconnected from server. Reconnecting...");
        setTimeout(connectWebSocket, 5000);
    });

    ws.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);
        console.log(
            "✅ Received message from server:\n",
            "🔌 Charge point ID: ",
            parsedMessage.charge_point_id,
            "\n📦 Raw message:\n",
            JSON.stringify(JSON.parse(parsedMessage.payload), null, 4)
        );
    });
}

export const sendToServer = (message: string) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    } else {
        console.log("❌ WebSocket is not open. Message not sent.");
    }
};

connectWebSocket();
