import { ISqlDatabase } from "@/core/ports/database/sql-database.interface.js";
import type { IEncryptHash } from "@/core/ports/encrypt/IEncryptHash.js";
import type { CreateUserDto } from "@/core/domain/user/dto/create-user.dto.js";
import type { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto.js";
import { User } from "@/core/domain/user/entities/user.entity.js";
import { HttpError } from "@/core/exceptions/HttpError.js";

export class UserService {
   constructor(
      private readonly passwordHasher: IEncryptHash,
      private readonly database: ISqlDatabase
   ) { }

   async findUserByUsername(username: string): Promise<User | null> {
      return await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
   }

   async findOneById(id: User['id']): Promise<User | null> {
      return await this.database.query(`SELECT * FROM users WHERE id = $1`, [id], User, { isArray: false });
   }

   async create({ password, username }: CreateUserDto): Promise<User> {
      const user = await this.findUserByUsername(username);
      if (user) throw new HttpError(409, 'User with this username already exists');
      const hashed_password = await this.passwordHasher.hash(password);

      const dbresult = await this.database.query(`INSERT INTO users (hashed_password, username) VALUES ($1, $2) RETURNING *`, [hashed_password, username], User, { isArray: false });

      return dbresult!;
   }

   async update(id: User['id'], updateUserDto: UpdateUserDto): Promise<User | null> {
      console.log(updateUserDto)
      const input = {
         hashed_password: updateUserDto.password ? await this.passwordHasher.hash(updateUserDto.password) : undefined,
         username: updateUserDto.username
      }
      for (const key in input) {
         //@ts-ignore
         if (input[key] === undefined) delete input[key];
      }

      const result = await this.database.query(`UPDATE users SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], User, { isArray: false });
      if (!result) throw new HttpError(404, 'User not found');
      return result;
   }

   async delete(user: User): Promise<User | null> {
      const result = await this.database.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [user.id], User, { isArray: false });
      if (result === null) throw new HttpError(404, "Not found");
      return result;
   }
}
