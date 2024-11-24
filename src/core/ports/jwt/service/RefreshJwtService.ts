import { AbstractJwtService } from "./AbstractJwtService";
import { JwtRefreshTokenPayload } from "../payload/JwtRefreshTokenPayload";

export abstract class RefreshJwtService extends AbstractJwtService<JwtRefreshTokenPayload> { }