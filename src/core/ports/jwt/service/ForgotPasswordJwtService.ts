import { JwtForgotPasswordTokenPayload } from "../payload/JwtForgotPasswordTokenPayload";
import { AbstractJwtService } from "./AbstractJwtService";

export abstract class ForgotPasswordJwtService extends AbstractJwtService<JwtForgotPasswordTokenPayload> {}
