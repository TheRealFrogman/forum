import { Token } from "./TToken";

export abstract class AbstractJwtService<TPayload extends object> {
   abstract verify(token: Token): Promise<TPayload>;
   abstract sign(payload: TPayload): Promise<Token>;
   abstract decode(token: Token): Promise<TPayload>;
}