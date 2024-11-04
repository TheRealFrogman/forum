import { AccessTokenPayload } from '@/core/auth/jwt/jwt-acess-token-payload';
import { IJwt } from '@/core/ports/jwt/jwt.interface';
import jwt from 'jsonwebtoken';

export class JwtImpl implements IJwt {
   constructor(
      private readonly secret: string,
   ) { }
   generateToken(payload: any): string {
      return jwt.sign(payload, this.secret, { expiresIn: "1m" });
   }
   validateToken(token: string): boolean {
      try {
         jwt.verify(token, this.secret, {});
         return true;
      } catch (error) {
         return false;
      }
   }
   decodeToken(token: string) {
      return jwt.decode(token);
   }
}
