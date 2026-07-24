export interface DomainEvent {
  type: string;
  payload: Record<string, unknown>;
  occurredAt?: Date;
}

type EventHandler = (event: DomainEvent) => void | Promise<void>;

const handlers: EventHandler[] = [];

export function subscribe(handler: EventHandler): () => void {
  handlers.push(handler);
  return () => {
    const idx = handlers.indexOf(handler);
    if (idx >= 0) handlers.splice(idx, 1);
  };
}

export async function publish(event: DomainEvent): Promise<void> {
  const enriched: DomainEvent = { ...event, occurredAt: event.occurredAt ?? new Date() };
  for (const handler of handlers) {
    await handler(enriched);
  }
}
