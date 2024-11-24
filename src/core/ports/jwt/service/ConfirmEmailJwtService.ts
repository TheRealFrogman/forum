import { JwtConfirmEmailPayload } from "../payload/JwtConfirmEmailPayload";
import { AbstractJwtService } from "./AbstractJwtService";

export abstract class ConfirmEmailJwtService extends AbstractJwtService<JwtConfirmEmailPayload> { }