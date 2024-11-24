import { AbstractJwtService } from "./AbstractJwtService";
import { AccessTokenPayload } from "../payload/JwtAccessTokenPayload";

export abstract class AccessJwtService extends AbstractJwtService<AccessTokenPayload> { }