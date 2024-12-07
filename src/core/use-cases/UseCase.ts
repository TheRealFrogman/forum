import { User } from "../domain/user/entities/user.entity";
import { EndpointResult } from "../routing/routes";
import { EventPublisher } from "./events/EventPublisher";

export abstract class UseCase<EventType extends object = object> extends EventPublisher<EventType> {
   protected canDo(user: User,...args: any[]): boolean {
      throw new Error("Not implemented");
   }
   abstract execute(...args: any[]): Promise<EndpointResult>
}