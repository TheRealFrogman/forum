
type Handler<T extends object> = (event: T) => void | Promise<void>
export abstract class EventPublisher<EventType extends object> {
   private readonly eventHandlers: Handler<EventType>[] = [];
   async subscribe(handler: Handler<EventType>): Promise<void> {
      this.eventHandlers.push(handler);
   }

   protected async publish(event: EventType): Promise<void> {
      // тут както надо логировать constructor.name
      console.log("publish is run")
      for (const handler of this.eventHandlers)
         await handler(event);
   }
}