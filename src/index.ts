import { HAWSClient } from "./client";

console.log("Starting node process...");

const SUPERVISOR_TOKEN = process.env["SUPERVISOR_TOKEN"];

if (SUPERVISOR_TOKEN == null) {
  throw new Error(
    "Can't initialise application: missing SUPERVISOR_TOKEN environment variable",
  );
}

(async () => {
  const ws = await HAWSClient.init(SUPERVISOR_TOKEN);

  const eventSubscriptionId = await ws.subscribeToEvents();

  ws.onMessage((message) => {
    switch (message.type) {
      case "event":
        if (message.id === eventSubscriptionId) {
          // @ts-ignore
          const newState = message.event.data.new_state;
          const eventInfo = {
            entityId: newState.entity_id,
            state: newState.state,
            friendlyName: newState.attributes.friendly_name,
          };
          console.log(`New data: ${JSON.stringify(eventInfo, null, 2)}`);
        }
        break;
      default:
        break;
    }
  });
})();
