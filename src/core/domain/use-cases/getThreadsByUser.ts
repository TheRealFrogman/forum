import { User } from "@/core/domain/user/entities/user.entity";
import { threadServiceInstance } from "@/dependencies";

export async function getThreadsByUser_UseCase(id: User['id']) {
   return await threadServiceInstance.findAllByUserId(id);
}