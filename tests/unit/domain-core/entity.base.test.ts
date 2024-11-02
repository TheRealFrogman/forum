import { describe, it } from "node:test";
import { Entity } from "@/core/domain-core/entity.base";
import assert from "node:assert";

class User extends Entity {
   constructor(
      public readonly id: number,
      private _username: string
   ) {
      super();
   }
   public get username() { return this._username }

   override isValid(): boolean {
      return this.id >= 1;
   }

   editUsername(newUsername: string) {
      this._username = newUsername;
   }
}
class Post extends Entity {
   override isValid(): boolean {
      return true;
   }
   constructor(
      public id: string | number,
   ) {
      super();
   }
}

describe("Entity", () => {

   describe("isValid", () => {
      it("should throw if invalid when i call any method", () => {
         const user1 = new User(0, "invalid user");
         assert.throws(() => user1.editUsername("im still invalid and this function call throws error"), Error);

         const user2 = new User(0, "invalid user");
         const user3 = new User(0, "invalid user");
         assert.throws(() => user2.is(user3))

         const user = new User(123, "im valid");
         user.editUsername("still valid");
      })
   })

   describe("is", () => {
      it("should match if constrcutor and id are the same, and not if they are different", () => {
         const user123 = new User(123, "im valid");
         const anotherUser123 = new User(123, "im valid");

         assert.ok(user123.is(anotherUser123));

         const post = new Post(123);
         assert.ok(!user123.is(post))
      })
   })
})