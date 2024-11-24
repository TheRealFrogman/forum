import { User } from "@/core/domain/user/entities/user.entity";

export class JwtForgotPasswordTokenPayload {
   constructor(
      public readonly userId: User['id'],
   ) {}
}