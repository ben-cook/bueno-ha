type AuthMessageType = "auth" | "auth_required" | "auth_ok" | "auth_invalid";
type RegularMessageType = "subscribe_events";

export type AuthMessage<
  Type extends AuthMessageType,
  Data extends any = unknown,
> = Data & {
  type: Type;
};

export type AuthTokenMessage = AuthMessage<"auth", { access_token: string }>;

export type Message<
  Type extends RegularMessageType,
  Data extends any = unknown,
> = Data & {
  id: number;
  type: Type;
};

type EventType = "state_changed";

export type StartCommandMessage = Message<
  "subscribe_events",
  {
    event_type?: EventType;
  }
>;

export interface MessageEvent {
  event_type: string;
  data: Data;
  origin: string;
  time_fired: string;
  context: EventContext;
}

interface Data {
  entity_id: string;
  old_state: State;
  new_state: State;
}

interface State {
  entity_id: string;
  state: string;
  attributes: Attributes;
  last_changed: string;
  last_reported: string;
  last_updated: string;
  context: EventContext;
}

interface Attributes {
  state_class: string;
  unit_of_measurement: string;
  device_class: string;
  friendly_name: string;
}

interface EventContext {
  id: string;
  parent_id: string | null;
  user_id: string | null;
}
