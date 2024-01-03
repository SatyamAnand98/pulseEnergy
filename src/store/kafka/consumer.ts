import { Kafka, Consumer } from "kafkajs";
import { BatchProcessor } from "../../helpers/saveToDb";

class KafkaConsumerSingleton {
    private static consumer: Consumer;
    private static isConnected: boolean = false;
    private static TOPIC: string = "my-topic";
    private static BATCH_PROCESSOR = new BatchProcessor();

    static async getConsumer(): Promise<Consumer> {
        if (!this.consumer) {
            const kafka = new Kafka({
                clientId: "my-app",
                brokers: ["127.0.0.1:9092"],
            });

            this.consumer = kafka.consumer({ groupId: "temp_group" });
            console.log("Creating new Kafka consumer instance");
        }

        if (!this.isConnected) {
            await this.consumer.connect();
            await this.consumer.subscribe({
                topic: this.TOPIC,
                fromBeginning: true,
            });
            this.isConnected = true;
            console.log("Kafka Consumer connected and subscribed to topic");
        }

        return this.consumer;
    }

    static async consumeMessages(): Promise<void> {
        const consumer = await this.getConsumer();

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(
                    `Received message from ${topic}:${partition}: ${message.value.toString()}`
                );
                const data = JSON.parse(message.value.toString());
                this.BATCH_PROCESSOR.saveData(data.chargerId, data);
            },
        });
    }
}

KafkaConsumerSingleton.consumeMessages()
    .then(() => console.log("Consumer started successfully"))
    .catch((e) => console.error("Error starting consumer", e));
