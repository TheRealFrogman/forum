import { User } from "@/core/domain/user/entities/user.entity";

export class JwtConfirmEmailPayload {
   constructor(
      public readonly userId: User['id'],
   ) {}
}