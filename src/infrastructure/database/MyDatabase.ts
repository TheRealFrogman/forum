import { IMyDatabase } from "@/core/database/my-database.interface";
import { Pool } from "pg"
export class MyDatabase implements IMyDatabase {
   constructor(
      private pool = new Pool({
         user: process.env['DB_USER'],
         host: process.env['DB_HOST'],
         database: process.env['DB_NAME'],
         password: process.env['DB_PASSWORD'],
         port: Number(process.env['DB_PORT']),
      })
   ) { }

   query<T>(cls: new (...args: any[]) => T, query: string, params?: unknown[]): Promise<T | T[] | null> {
      return new Promise((resolve, reject) => {
         this.pool.query(query, params).then((result) => {
            if (result.rowCount === 0) {
               resolve(null);
            } else if (result.rowCount === 1) {
               const instance = new cls(...result.rows[0]);
               resolve(instance);
            } else {
               const instances = result.rows.map((row) => new cls(...row));
               resolve(instances);
            }
         }).catch((err) => {
            reject(err);
         });
      })
   }
}