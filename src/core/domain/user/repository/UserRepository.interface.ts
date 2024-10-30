import type { Thread } from "../../thread/entities/thread.entity.js";
import type { User } from "../entities/user.entity.js";

export abstract class IUserRepository {
   abstract findOne(id: User['id']): Promise<User | null>
   abstract findOneByUsername(username: User['username']): Promise<User | null>
   abstract findAllByThread(threadId: Thread['id']): Promise<User[]>
   abstract create(userData: Pick<User, 'hashed_password' | 'username'>): Promise<User>
   abstract update(id: User['id'], partialUserData: Partial<Pick<User, 'hashed_password' | 'username'>>): Promise<User | null>
   abstract remove(id: User['id']): Promise<void>
}