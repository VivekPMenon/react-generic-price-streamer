import {Connector, Message, MessageHandler, MessageLike} from "@/lib/utility/SubscriptionTypes";

export class WorkerBasedConnector implements Connector {
    private worker: Worker|undefined;

    constructor(private readonly script: string) {}

    public addHandler(handler: MessageHandler): void {
        this.checkConnection();

        this.worker!.onmessage = (event) => {
            const message: Message = event.data;
            handler(message);
        };
    }

    public send(message: MessageLike): void {
        this.checkConnection();
        this.worker!.postMessage(message);
    }

    public dispose(): void {
        this.worker?.terminate();
    }

    public connect() {
        if (this.worker) {
            return;
        }
        this.worker = new Worker(this.script);
    }

    private checkConnection() {
        if (!this.worker) {
            this.connect();
        }

        if (!this.worker) {
            throw new Error('Failed to connect');
        }
    }
}