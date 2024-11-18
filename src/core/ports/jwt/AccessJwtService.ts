import { AbstractJwtService } from "./AbstractJwtService";
import { AccessTokenPayload } from "./JwtAccessTokenPayload";

export abstract class AccessJwtService extends AbstractJwtService<AccessTokenPayload> { }