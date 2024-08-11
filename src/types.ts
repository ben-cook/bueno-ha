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
