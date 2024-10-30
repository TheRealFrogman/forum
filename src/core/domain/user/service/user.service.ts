import { IMyDatabase } from "@/core/database/my-database.interface.js";
import type { IEncryptHash } from "../../../encrypt/IEncryptHash.js";
import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { UpdateUserDto } from "../dto/update-user.dto.js";
import { User } from "../entities/user.entity.js";

export class UserService {
   constructor(
      private readonly passwordHasher: IEncryptHash,
      private readonly database: IMyDatabase
   ) {
      this.create({ password: "admin123", username: "admin" })
         .catch(() => { });
      this.create({ password: "john_doe", username: "john" })
         .catch(() => { });
      this.create({ password: "jane_doe", username: "jane" })
         .catch(() => { });
   }

   async findUserByUsername(username: string): Promise<User | null> {
      const result = await this.database.query(User, `SELECT * FROM users WHERE username = $1`, [username]);
      if (Array.isArray(result)) throw new Error("Error finding user by username");
      return result;
   }

   async create({ password, username }: CreateUserDto) {
      const user = await this.findUserByUsername(username);
      if (user) throw new Error('User with this username already exists');
      const hashed_password = await this.passwordHasher.hash(password);

      const newUser = await this.database.query(User, `INSERT INTO users (hashed_password, username) VALUES ($1, $2) RETURNING *`, [hashed_password, username]);

      return newUser;
   }

   async findOne(id: User['id']): Promise<User | null> {
      const result = await this.database.query(User, `SELECT * FROM users WHERE id = $1`, [id]);
      if (Array.isArray(result)) throw new Error("Error finding user by username");
      return result;
   }

   async update(id: User['id'], updateUserDto: UpdateUserDto): Promise<User | null> {

      const input = {
         hashed_password: updateUserDto.password ? await this.passwordHasher.hash(updateUserDto.password) : undefined,
         username: updateUserDto.username
      }
      // это странный код снизу
      const result = await this.database.query(User, `UPDATE users SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)]);
      if (!result) throw new Error('User not found');
      if (Array.isArray(result)) throw new Error("Error finding user by username");
      return result;
   }

   async remove(id: User['id']): Promise<User | null> {
      const result = await this.database.query(User, `DELETE FROM users WHERE id = $1`, [id]);
      if (Array.isArray(result)) throw new Error("Error finding user by username");
      return result;
   }
}
