import { AbstractJwtService } from '@/core/ports/jwt/service/AbstractJwtService';
import { Token } from '@/core/ports/jwt/Token';
import jwt from 'jsonwebtoken';
export interface Params {
   secret: string,
   signOptions: jwt.SignOptions,
   verifyOptions: jwt.VerifyOptions,
   decodeOptions: jwt.DecodeOptions,
}
export class JwtImpl<TPayload extends object> implements AbstractJwtService<TPayload> {
   private readonly secret: string;
   private readonly signOptions: jwt.SignOptions;
   private readonly verifyOptions: jwt.VerifyOptions;
   private readonly decodeOptions: jwt.DecodeOptions;
   constructor(params: Params) {
      this.secret = params.secret;
      this.signOptions = params.signOptions;
      this.verifyOptions = params.verifyOptions;
      this.decodeOptions = params.decodeOptions;
   }
   async verify(token: Token): Promise<TPayload> {
      return jwt.verify(token, this.secret, this.verifyOptions) as TPayload
   }
   async sign(payload: TPayload): Promise<Token> {
      return jwt.sign(payload, this.secret, this.signOptions) as Token
   }
   async decode(token: Token): Promise<TPayload> {
      return jwt.decode(token, this.decodeOptions) as TPayload;
   }
}
