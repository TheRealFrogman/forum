import { JwtForgotPasswordTokenPayload } from "../payload/JwtForgotPasswordTokenPayloa";
import { AbstractJwtService } from "./AbstractJwtService";

export abstract class ForgotPasswordJwtService extends AbstractJwtService<JwtForgotPasswordTokenPayload> {}
