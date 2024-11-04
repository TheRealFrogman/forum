import { User } from "../../domain/user/entities/user.entity";

export class AccessTokenPayload {
   constructor(
      public readonly userId: User['id'],
      public readonly username: User['username'],
   ) { }
}