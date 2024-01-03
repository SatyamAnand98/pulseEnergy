import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cluster from "cluster";
import os from "os";
import pino from "pino";
import { KafkaProducerSingleton } from "../store/kafka/producer";
import { BatchProcessor } from "../helpers/saveToDb";
import dotenv from "dotenv";
dotenv.config();

const logger = pino({
    level: process.env.LOG_LEVEL,
});

const PORT = process.env.PORT || 3000;
const TOPIC = process.env.KAFKA_TOPIC;
const ENABLE_KAFKA: boolean = process.env.ENABLE_KAFKA === "true" || false;
const BATCH_PROCESSOR = new BatchProcessor();
const UTILIZE_CPU_CORES: boolean =
    process.env.UTILIZE_CPU_CORES === "true" || false;

if (cluster.isPrimary && UTILIZE_CPU_CORES) {
    logger.info(`🟢 Master ${process.pid} is running`);

    const numCPUs = os.cpus().length;
    logger.info(`🟢 Forking ${numCPUs} CPUs`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        logger.error(`🔴 Worker ${worker.process.pid} died`);
        logger.info("🟢 Starting a new worker");
        cluster.fork();
    });
} else {
    const httpServer = http.createServer();
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        logger.info(`New connection ${socket.id}`);

        socket.on("message", async (message) => {
            try {
                const parsedMessage =
                    typeof message === "object" ? message : JSON.parse(message);
                socket.emit("onResponse", parsedMessage);

                if (ENABLE_KAFKA) {
                    KafkaProducerSingleton.sendToKafka(
                        JSON.stringify({
                            chargerId: parsedMessage.charge_point_id,
                            payload: JSON.parse(parsedMessage.payload),
                        }),
                        TOPIC
                    )
                        .then(() =>
                            logger.info("Message sent to kafka successfully")
                        )
                        .catch((e) =>
                            logger.error("Error sending message to kafka: ", e)
                        );
                } else {
                    BATCH_PROCESSOR.saveData(
                        parsedMessage.charge_point_id,
                        JSON.parse(parsedMessage.payload)
                    );
                }
            } catch (error) {
                logger.error(`Error with message from ${socket.id}: `, error);
            }
        });

        socket.on("disconnect", () => {
            logger.info(`Connection with ${socket.id} closed`);
        });
    });

    httpServer.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
    });

    const gracefulShutdown = () => {
        logger.info("Shutting down gracefully...");
        io.close(() => {
            logger.info("Closed out remaining connections.");
            process.exit(0);
        });

        setTimeout(() => {
            logger.error(
                "Could not close connections in time, forcefully shutting down"
            );
            process.exit(1);
        }, 10000);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
}
