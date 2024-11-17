import { userServiceInstance } from "@/dependencies";
import { CreateUserDto } from "@/core/domain/user/dto/create-user.dto";

export async function createUser_UseCase(body: CreateUserDto) {
   return await userServiceInstance.create(body as CreateUserDto);
}