import { Pool as PgPool, type PoolConfig, } from "pg";
import process from "node:process";
import { setImmediate } from "node:timers";

setImmediate(() => {
   process.on("SIGINT", () => {
      process.exit(0);
   })
   process.on("SIGTERM", () => {
      process.exit(0);
   })
});

export class MyPool {
   private pool: PgPool;
   constructor(private options: PoolConfig) {
      this.pool = new PgPool(this.options);
      process.on("SIGINT", () => {
         this.pool.end();
      })
      process.on("SIGTERM", () => {
         this.pool.end();
      })
   }

   getConnection() {
      return this.pool.connect();
   }
   query(query: string, values?: unknown[]) {
      return this.pool.query(query, values);
   }
}
