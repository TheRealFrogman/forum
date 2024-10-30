import type { Thread } from "../../../core/domain/thread/entities/thread.entity.ts";
import type { IUserRepository } from "../../../core/domain/user/repository/UserRepository.interface.js";
import type { MyPool } from "../../my-pool.ts";
import { User } from "@/core/domain/user/entities/user.entity.js";
export class UserRepository implements IUserRepository {
   constructor(
      private readonly pool: MyPool,
   ) { }

   async findOne(id: User['id']): Promise<User | null> {
      const client = await this.pool.getConnection();
      try {
         const result = await client.query<User>('SELECT * FROM users WHERE id = $1', [id]);
         const userData = result.rows[0];
         return userData ? User.fromValidData(userData) : null;
      } catch (error) {
         console.error("Error finding user:", error);
         throw error; // Re-throw the error for proper handling in the calling function.
      } finally {
         client.release();
      }
   }


   async findOneByUsername(username: User['username']): Promise<User | null> {
      const client = await this.pool.getConnection();
      try {
         const result = await client.query<User>('SELECT * FROM users WHERE username = $1', [username]);
         const userData = result.rows[0];
         return userData ? User.fromValidData(userData) : null;
      } catch (error) {
         console.error("Error finding user by username:", error);
         throw error;
      } finally {
         client.release();
      }
   }


   async findAllByThread(threadId: Thread['id']): Promise<User[]> {
      const client = await this.pool.getConnection();
      try {
         const result = await client.query<User>(
            'SELECT * FROM users WHERE id IN (SELECT user_id FROM thread_users WHERE thread_id = $1)',
            [threadId]
         );

         return result.rows.map((row) => User.fromValidData(row));
      } catch (error) {
         console.error("Error finding users by thread:", error);
         throw error;
      } finally {
         client.release();
      }
   }


   async create(userData: Pick<User, 'hashed_password' | 'username'>): Promise<User> {
      const client = await this.pool.getConnection();
      try {
         const result = await client.query<User>(
            'INSERT INTO users (hashed_password, username) VALUES ($1, $2) RETURNING *',
            [userData.hashed_password, userData.username]
         );
         return User.fromValidData(result.rows[0]!);
      } catch (error) {
         console.error("Error creating user:", error);
         throw error;
      } finally {
         client.release();
      }
   }


   // ... (Implement other methods similarly, adding error handling and specific SQL for each)
   // Note:  Crucially, these functions also include `try...catch` blocks. This is critical for robustness.
   // Example for update (important to return the updated row)
   async update(id: User['id'], partialUserData: Partial<Pick<User, 'hashed_password' | 'username'>>): Promise<User | null> {
      const client = await this.pool.getConnection();
      try {
         let updateQuery = 'UPDATE users SET ';
         const updateValues = [];
         let i = 1;
         for (const key in partialUserData) {
            if (partialUserData.hasOwnProperty(key)) {
               updateQuery += `${key} = $${i}, `;

               //@ts-expect-error
               updateValues.push(partialUserData[key]);
               i++;
            }
         }
         // Remove trailing comma and space.
         updateQuery = updateQuery.slice(0, -2);
         updateQuery += ` WHERE id = $${i} RETURNING *`;
         updateValues.push(id);
         const result = await client.query<User>(updateQuery, updateValues);

         const userData = result.rows[0];
         return userData ? User.fromValidData(userData) : null;
      } catch (error) {
         console.error("Error updating user:", error);
         throw error;
      } finally {
         client.release();
      }
   }

   // ... (Implement remove method)
   async remove(id: User['id']): Promise<void> {
      const client = await this.pool.getConnection();
      try {
         const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
         if (result.rowCount === 0) {
            throw new Error(`User with ID ${id} not found`);
         }
      } catch (error) {
         console.error("Error removing user:", error);
         throw error;
      } finally {
         client.release();
      }
   }

}