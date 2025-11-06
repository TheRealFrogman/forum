import { EndpointResult } from "@/core/routing/reused-code/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { UserService } from "@/core/domain/user/service/user.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";

@injectable()
export class ConfirmEmail_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
   ) {
      super();
   }
   async execute(userId: User['id']): Promise<EndpointResult> {
      const user = await this.userService.findOneById(userId);
      if (!user)
         return { statusCode: 404, statusMessage: "User not found" };

      const updatedUser = await this.database.query(`UPDATE users SET email_confirmed = $1 WHERE id = $2 RETURNING *`, [true, user.id], User, { isArray: false });
      if (!updatedUser)
         return { statusCode: 500, statusMessage: "Email confirmation failed" };

      return { statusCode: 200, statusMessage: "Email confirmed" };
   }
}