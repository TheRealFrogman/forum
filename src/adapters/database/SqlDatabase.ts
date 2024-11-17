import { ISqlDatabase } from "@/core/ports/database/sql-database.interface";
import { Pool } from "pg"
export class SqlPoolDatabase implements ISqlDatabase {
   constructor(
      private pool = new Pool({
         user: process.env['DB_USER'],
         host: process.env['DB_HOST'],
         database: process.env['DB_NAME'],
         password: process.env['DB_PASSWORD'],
         port: Number(process.env['DB_PORT']),
      })
   ) { }

   private mapDataToInstance<T extends object>(cls: new (...args: any[]) => T, data: object) {
      const json = JSON.parse(JSON.stringify(data));

      const instance = new cls();
      for (const key in instance) {
         if (Object.prototype.hasOwnProperty.call(instance, key)) {
            //@ts-ignore
            instance[key] = data[key];
         }
      }

      if (Object.keys(instance).length !== Object.keys(data).length)
         throw new Error("Amount of instance fields is not equal to amount of data fields");

      return instance;
   }

   // перегрузки для того чтобы видеть контракты прямо тут
   query<T extends object>(query: string, params?: unknown[]): Promise<null>;
   query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: false }): Promise<T | null>;
   query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: true }): Promise<T[]>;
   query<T extends object>(query: string, params?: unknown[], cls?: new (...args: any[]) => T, opts?: { isArray: boolean }): Promise<T | T[] | null> {
      return new Promise((resolve, reject) => {
         this.pool.query(query, params).then((result) => {
            if (result.rowCount === 0) {
               resolve(null);
            }
            else {
               if (!cls) return resolve(null);

               const instances = result.rows.map((row) => this.mapDataToInstance(cls, row)!);
               if (instances.length === 1) {
                  if (opts?.isArray === true) {
                     throw new Error("Single object expected, check your query");
                  }
                  resolve(instances[0]!);
               } else {
                  if (opts?.isArray === false) {
                     throw new Error("Array expected, check your query");
                  }
                  resolve(instances);
               }
            }
         }).catch((err) => {
            reject(err);
         });
      })
   }
}