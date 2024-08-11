import WebSocket from "ws";
import { Message, MessageSchema, isAuthMessage } from "./helpers";

const WS_URL = "ws://supervisor/core/websocket";

function parseMessage(raw: { toString: () => string }): Message {
  const json = JSON.parse(raw.toString());
  const parsed = MessageSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(`Failed to parse message: ${parsed.error}`);
  }

  return parsed.data;
}

/** Home Assistant Web Socket client */
export class HAWSClient {
  private authToken;
  private client!: WebSocket;
  private eventSubscriptions = new Map<number, Function>();

  /** See `init` method for public constructor */
  private constructor(authToken: string) {
    this.authToken = authToken;
  }

  /** Create websocket connection and completes the authentication flow */
  private setupWebSocket(): Promise<void> {
    return new Promise((resolve) => {
      this.client = new WebSocket(WS_URL);

      this.client.on("error", console.error);

      this.client.on("open", () => {
        console.log("HAWSClient: Websocket opened");
      });

      this.client.on("close", () => {
        console.log("HAWSClient: Websocket closed");
      });

      // Set up logger
      this.client.on("message", (raw) => {
        console.log(`HAWSClient: RECV_RAW ${raw}`);
        const message = parseMessage(raw);
        console.log(`HAWSClient: RECV ${JSON.stringify(message, null, 2)}`);
      });

      // Set up auth flow
      this.client.on("message", (raw) => {
        const message = parseMessage(raw);
        if (message.type === "auth_required") {
          this.send({
            type: "auth",
            access_token: this.authToken,
          });
          return;
        }

        if (message.type === "auth_ok") {
          resolve();
          return;
        }
      });
    });
  }

  /** Create a new HAWSClient instance */
  public static init(authToken: string): Promise<HAWSClient> {
    return (async () => {
      const haws = new HAWSClient(authToken);
      await haws.setupWebSocket();
      return haws;
    })();
  }

  public onMessage(callback: (message: Message) => void) {
    this.client.on("message", (raw) => {
      const message = parseMessage(raw);
      if (isAuthMessage(message)) return;
      callback(message);
    });
  }

  private newEventSubscriptionId(): number {
    const currentEventIds = new Set(this.eventSubscriptions.keys());
    while (true) {
      const newId = Math.floor(Math.random() * 512);
      if (currentEventIds.has(newId)) continue;
      return newId;
    }
  }

  /** Subscribes to an event stream and returns the id associated with the
   * event stream
   */
  public async subscribeToEvents(): Promise<number> {
    return new Promise((resolve) => {
      const id = this.newEventSubscriptionId();

      const callback = (raw: string) => {
        const message = parseMessage(raw);

        if (message.type !== "result") return;
        if (message.id == null) return;

        if (message.id !== id) return;

        onSuccess(id);
      };

      // Handler for when the result is successful
      const onSuccess = (subscriptionId: number) => {
        this.client.off("message", callback);
        resolve(subscriptionId);
      };

      // Set up listener for result
      this.client.on("message", callback);

      // Subscribe to events
      this.send({
        id,
        type: "subscribe_events",
        event_type: "state_changed",
      });
    });
  }

  public send(data: object) {
    console.log(`HAWSClient: SEND ${JSON.stringify(data, null, 2)}`);
    this.client.send(JSON.stringify(data));
  }
}
