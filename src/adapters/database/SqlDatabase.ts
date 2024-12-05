import { PgCursorDatabase } from "@/core/ports/database/pg-cursor-database/pg-cursor-database";
import { ISqlDatabaseConnectionBinder } from "@/core/ports/database/single-connection-database/ISqlDatabaseConnectionBinder";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { injectable } from "inversify";
import { Client, Pool, PoolClient, } from "pg"
import Cursor from 'pg-cursor';

type SomeClass<T> = new (...args: any[]) => T

function mapDataToInstance<T extends object>(cls: SomeClass<T>, data: object) {
   JSON.parse(JSON.stringify(data));

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

async function makeQuery<T extends object>(client: PoolClient | Client | Pool, query: string, params?: unknown[], cls?: SomeClass<T>, opts?: { isArray: boolean },): Promise<T | T[] | null> {
   const result = await client.query(query, params)

   if (result.rowCount === 0) {
      return null
   } else {
      if (!cls)
         return null

      const instances = result.rows.map((row) => mapDataToInstance(cls, row)!);
      if (instances.length === 1) {
         if (opts?.isArray === true) {
            throw new Error("Single object expected, check your query");
         }
         return instances[0]!;
      } else {
         if (opts?.isArray === false) {
            throw new Error("Array expected, check your query");
         }
         return instances;
      }
   }

}


@injectable()
export class SqlPoolDatabase implements ISqlDatabase, ISqlDatabaseConnectionBinder, PgCursorDatabase {
   constructor(
      private pool: Pool,
   ) { }
   async queryCursor<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T): Promise<{ read: (amount: number) => Promise<T[]>; }> {
      const client = await this.pool.connect();
      const cursor = client.query(new Cursor(query, params));
      return {
         async read(amount) {
            const rows = await cursor.read(amount)
            return rows.map((row) => mapDataToInstance(cls, row));
         },
         // release() {
         //    client.release();
         // }
      }
   }
   // перегрузки для того чтобы видеть контракты прямо тут
   query<T extends object>(query: string, params?: unknown[]): Promise<null>;
   query<T extends object>(query: string, params: unknown[], cls: SomeClass<T>, opts: { isArray: false }): Promise<T | null>;
   query<T extends object>(query: string, params: unknown[], cls: SomeClass<T>, opts: { isArray: true }): Promise<T[]>;
   async query<T extends object>(query: string, params?: unknown[], cls?: SomeClass<T>, opts?: { isArray: boolean }): Promise<T | T[] | null> {
      return makeQuery(this.pool, query, params, cls, opts);
   }
   async connect(): Promise<{ query: ISqlDatabase['query'], release: (err?: Error | boolean) => Promise<void> }> {
      const poolClient = await this.pool.connect()
      let released = false;
      return new class {
         async release(err?: Error | boolean) {
            released = true;
            return poolClient.release(err);
         }
         async query<T extends object>(query: string, params?: unknown[], cls?: SomeClass<T>, opts?: { isArray: boolean }): Promise<T | T[] | null> {
            if (released)
               throw new Error("Connection already released");

            return makeQuery(poolClient, query, params, cls, opts);
         }
      };
   }
}