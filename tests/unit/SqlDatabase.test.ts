import { after, before, describe, it } from "node:test";
import assert from "node:assert";

import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { Pool } from "pg";

class UserConProps {
   constructor(
      public id: number,
      public username: string,
   ) { }
}
class UserObjectAssign {
   public id!: number
   public username!: string
   constructor(props: UserObjectAssign) {
      Object.assign(this, props);
   }
}
const sqlUserDefinition = `
create table if not exists users (
   id serial primary key,
   username text not null   
)`
describe("SqlDatabase", () => {

   const database = new SqlPoolDatabase(new Pool({
      user: "postgres",
      host: "localhost",
      database: "test",
      password: "test",
      port: 5432
   }));

   before(async () => {
      database.query(sqlUserDefinition);
   })
   after(async () => {
      database.query("DROP TABLE users");
   })
   describe("query", () => {
      it("should create user", async () => {
         const user = await database.query<UserConProps>("INSERT INTO users (username) VALUES ($1) RETURNING *", ["test"], UserConProps, { isArray: false });

         assert(!Array.isArray(user));
         assert.equal(user?.username, "test");
      })
      it("should retrieve user", async () => {
         const user = await database.query<UserConProps>("SELECT * FROM users WHERE id = $1", [1], UserConProps, { isArray: false });

         assert(!Array.isArray(user));
         assert.equal(user?.username, "test");
         assert.equal(user?.id, 1);
      })
   })
})