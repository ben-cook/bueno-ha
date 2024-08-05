import WebSocket from "ws";
import { z } from "zod";

const WS_URL = "ws://supervisor/core/websocket";

const MessageSchema = z
  .object({
    type: z.string(),
  })
  .passthrough();

type Message = z.infer<typeof MessageSchema>;

/** Home Assistant Web Socket client */
export class HAWSClient {
  private authToken;
  private client;

  constructor(authToken: string) {
    this.authToken = authToken;
    this.client = new WebSocket(WS_URL);

    this.client.on("error", console.error);

    this.client.on("open", () => {
      console.log("websocket opened");
    });

    this.client.on("close", () => {
      console.log("websocket closed");
    });
  }

  public onMessage(callback: (message: Message) => void) {
    this.client.on("message", (rawData) => {
      const json = JSON.parse(rawData.toString());
      const parsed = MessageSchema.safeParse(json);

      if (!parsed.success) {
        throw new Error(`Failed to parse message: ${parsed.error}`);
      }

      const message = parsed.data;

      if (message.type === "auth_required") {
        this.send({
          type: "auth",
          access_token: this.authToken,
        });
        return;
      }

      callback(message);
    });
  }

  public send(data: object) {
    this.client.send(JSON.stringify(data));
  }
}
