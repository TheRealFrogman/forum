import { Token } from "../Token";

export abstract class AbstractJwtService<P extends object> {
   abstract sign(payload: P): Promise<Token>;
   abstract verify(token: Token): Promise<P>;
   abstract decode(token: Token): Promise<P>;
}