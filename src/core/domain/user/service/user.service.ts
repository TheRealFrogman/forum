import { IRepository } from "@/core/repository/repository.interface.js";
import type { IEncryptHash } from "../../../encrypt/IEncryptHash.js";
import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { UpdateUserDto } from "../dto/update-user.dto.js";
import { User } from "../entities/user.entity.js";

export class UserService {
   constructor(
      private readonly passwordHasher: IEncryptHash,
      private readonly userRepository: IRepository<User>
   ) {
      this.create({ password: "admin123", username: "admin" })
         .catch(() => { });
      this.create({ password: "john_doe", username: "john" })
         .catch(() => { });
      this.create({ password: "jane_doe", username: "jane" })
         .catch(() => { });
   }

   findUserByUsername(username: string): Promise<User | null> {
      return this.userRepository.findOneBy({ username });
   }

   async create({ password, username }: CreateUserDto) {
      const user = await this.findUserByUsername(username);
      if (user) throw new Error('User with this username already exists');
      const hashed_password = await this.passwordHasher.hash(password);

      const newUser = await this.userRepository.create({ hashed_password, username });

      return newUser;
   }

   findOne(id: User['id']) {
      return this.userRepository.findOne(id);
   }

   async update(id: User['id'], updateUserDto: UpdateUserDto) {

      return this.userRepository.update(id, {
         hashed_password: updateUserDto.password ? await this.passwordHasher.hash(updateUserDto.password) : undefined,
         username: updateUserDto.username
      });
   }

   remove(id: User['id']) {
      return this.userRepository.remove(id);
   }
}
