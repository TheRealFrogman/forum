import { ISqlDatabase } from "@/core/ports/database/sql-database.interface";
import { Pool } from "pg"
export class SqlDatabase implements ISqlDatabase {
   constructor(
      private pool = new Pool({
         user: process.env['DB_USER'],
         host: process.env['DB_HOST'],
         database: process.env['DB_NAME'],
         password: process.env['DB_PASSWORD'],
         port: Number(process.env['DB_PORT']),
      })
   ) { }

   query<T>(query: string, params?: unknown[], cls?: new (...args: any[]) => T,): Promise<T | T[] | null> {
      return new Promise((resolve, reject) => {
         this.pool.query(query, params).then((result) => {
            if (result.rowCount === 0) {
               resolve(null);
            }
            else {
               if (!cls) return resolve(null);

               if (result.rowCount === 1) {
                  const json = JSON.parse(JSON.stringify(result.rows[0]));
                  console.log(json);

                  const instance = new cls();
                  for (const key in instance) {
                     if (Object.prototype.hasOwnProperty.call(instance, key)) {
                        instance[key] = result.rows[0][key];
                     }
                  }
                  resolve(instance);
               } else {
                  const instances = result.rows.map((row) => new cls(...row));
                  resolve(instances);
               }
            }
         }).catch((err) => {
            reject(err);
         });
      })
   }
}