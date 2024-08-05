import { StartCommandMessage } from "./types";
import { HAWSClient } from "./client";

console.log("Starting node process...");

const SUPERVISOR_TOKEN = process.env["SUPERVISOR_TOKEN"];

if (SUPERVISOR_TOKEN == null) {
  throw new Error(
    "Can't initialise application: missing SUPERVISOR_TOKEN environment variable",
  );
}

const ws = new HAWSClient(SUPERVISOR_TOKEN);

ws.onMessage((message) => {
  console.log(`received message: ${JSON.stringify(message, null, 2)}`);

  switch (message.type) {
    case "auth_ok":
      // subscribe to events
      ws.send({
        id: 10,
        type: "subscribe_events",
        event_type: "state_changed",
      } satisfies StartCommandMessage);
      break;
  }
});
