import { Kafka, Producer } from "kafkajs";

class KafkaProducerSingleton {
    private static producer: Producer;
    private static isConnected: boolean = false;

    static async getProducer(): Promise<Producer> {
        if (!this.producer) {
            const kafka = new Kafka({
                clientId: "my-app",
                brokers: ["127.0.0.1:9092"],
            });

            this.producer = kafka.producer();
            console.log("Creating new Kafka producer instance");
        }

        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
            console.log("Kafka Producer connected");
        }

        return this.producer;
    }

    static async sendToKafka(message: string, topic: string): Promise<void> {
        const producer = await this.getProducer();
        await producer.send({
            topic: topic,
            messages: [{ value: message }],
        });
    }
}

export { KafkaProducerSingleton };
