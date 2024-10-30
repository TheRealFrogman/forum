import { Validator } from "jsonschema";
import { User } from "./core/domain/user/entities/user.entity";
const userSchema = require("./core/domain/user/entities/user.schema.json");
var v = new Validator();

const instance = new User({
   hashed_password: "hashedPa:ssword1",
   username: "user1",
   id: 1
})

const result = v.validate(instance, userSchema,);

console.log(result)