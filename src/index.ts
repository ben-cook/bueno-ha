import { BuenoClient } from "./BuenoClient";
import { HAWSClient } from "./HAWSClient";
import { EnvVarSchema } from "./env";
import { FloatSchema } from "./util/validators";
import type { MessageEvent } from "./types";

const parseResult = EnvVarSchema.safeParse(process.env);

if (!parseResult.success) {
  throw new Error(
    `Can't initialise application: missing required environment variables.
    ${parseResult.error}`,
  );
}

const {
  SUPERVISOR_TOKEN: supervisorToken,
  ENTITIES: entities,
  BUENO_INTEGRATION_ID: integrationId,
  BUENO_API_URL: apiUrl,
  BUENO_CREDENTIALS: { email, password },
} = parseResult.data;

(async () => {
  const ws = await HAWSClient.init(supervisorToken);
  const bueno = new BuenoClient(apiUrl, email, password);

  for (const entity of entities) {
    const eventSubscriptionId = await ws.subscribeToEvents();

    ws.onMessage((message) => {
      switch (message.type) {
        case "event":
          if (message.id === eventSubscriptionId) {
            const event = message.event as MessageEvent;
            const eventData = event.data;
            const newState = eventData.new_state;
            const eventInfo = {
              entityId: newState.entity_id,
              value: FloatSchema.parse(newState.state),
              friendlyName: newState.attributes.friendly_name,
              timestamp: event.time_fired,
            };

            if (eventInfo.entityId === entity.ha_sensor_id) {
              console.log(`New data: ${JSON.stringify(eventInfo, null, 2)}`);
              if (eventInfo.value != null) {
                bueno.ingestHistory({
                  integrationId,
                  timestamp: new Date(eventInfo.timestamp),
                  streamId: entity.bueno_data_stream_id,
                  value: eventInfo.value,
                });
              }
            } else {
              console.log(`discarding data for ${eventInfo.entityId}`);
            }
          }
          break;
        default:
          break;
      }
    });
  }
})();
