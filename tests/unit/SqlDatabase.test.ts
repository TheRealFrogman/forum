import 'reflect-metadata'

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
class UserObject {
   public id!: number
   public username!: string
   constructor(props: UserObject) {
      this.id = props.id;
      this.username = props.username;
   }
}
const sqlUserDefinition = `
   create table if not exists users (
      id serial primary key,
      username text not null   
   )
`
describe("SqlDatabase", async () => {

   const database = new SqlPoolDatabase(new Pool({
      user: "postgres",
      host: "localhost",
      database: "test",
      password: "test",
      port: 5432
   }));

   before(async () => {
      await database.query(sqlUserDefinition);
   })
   after(async () => {
      database.query("DROP TABLE users");
   })

   await describe("query", async () => {
      await it("should create user", async () => {
         const user = await database.query<UserConProps>("INSERT INTO users (username) VALUES ($1) RETURNING *", ["test"], UserConProps, { isArray: false });

         assert(!Array.isArray(user));
         assert.equal(user?.username, "test");
      })
      await it("should retrieve user and be of instance of class specified", async () => {
         const user = await database.query<UserConProps>("SELECT * FROM users WHERE id = $1", [1], UserConProps, { isArray: false });

         assert(!Array.isArray(user));
         assert.equal(user?.username, "test");
         assert.equal(user?.id, 1);
         assert(user instanceof UserConProps);
      })
      after(async () => {
         database.query("delete from users");
      })
   })
   // passes only when the upper test is skipped
   describe("connect", async () => {
      after(async () => {
         await database.query("delete from users"); 
      })
      await describe("query", async () => {
         await it("should make transaction properly", async () => {
            const oneConnectionDb1 = await database.connect();
            const oneConnectionDb2 = await database.connect();

            try {
               await oneConnectionDb1.query('BEGIN;');
               await oneConnectionDb1.query('INSERT INTO users (username) VALUES (\'test\')');
               const userNotCommitted = await oneConnectionDb2.query<UserConProps>("SELECT * FROM users WHERE username = $1", ["test"], UserConProps, { isArray: false });

               assert.equal(userNotCommitted, null);
               await oneConnectionDb1.query('COMMIT;');

               const userCommitted = await oneConnectionDb2.query<UserConProps>("SELECT * FROM users WHERE username = $1", ["test"], UserConProps, { isArray: false });

               assert.equal(userCommitted?.username, "test");

            } catch (err) {
               await oneConnectionDb1.query('ROLLBACK;');
               throw err
            } finally {
               await oneConnectionDb1.release();
            }
         })
         it("should throw on query if already released", async () => {
            const oneConnectionDb1 = await database.connect();
            oneConnectionDb1.release();

            try {
               await oneConnectionDb1.query('select * from users');
            } catch (error) {
               return
            }
            throw new Error("Didnt return from catch")
         })
      })
   })

   describe("queryCursor", async () => {
      before(async () => {
         for (let i = 0; i < 10; i++) {
            await database.query("INSERT INTO users (username) VALUES ($1)", [`test${i}`]);
         }
      })

      it("should work properly", async () => {
         const cursor = await database.queryCursor("SELECT * FROM users", [], UserConProps);
         const rows1 = await cursor.read(2);
         const rows2 = await cursor.read(2);
         const rows3 = await cursor.read(2);
         const rows4 = await cursor.read(2);
         const rows5 = await cursor.read(2);
         const rows6 = await cursor.read(2);
         assert.equal(rows1.length, 2);
         assert.equal(rows2.length, 2);
         assert.equal(rows3.length, 2);
         assert.equal(rows4.length, 2);
         assert.equal(rows5.length, 2);
         assert.equal(rows6.length, 0);
      })
   })
})