import { AbstractJwtService } from "./AbstractJwtService";
import { JwtRefreshTokenPayload } from "./JwtRefreshTokenPayload";

export abstract class RefreshJwtService extends AbstractJwtService<JwtRefreshTokenPayload> { }