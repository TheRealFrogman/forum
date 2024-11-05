import { Pool } from "pg";
import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validation/jsonschema-validator.impl";
import { LocalAuthenticator } from "@/core/auth/local/local-auth";
import { JwtImpl } from "./adapters/jwt/jwt.impl";
import { ThreadService } from "./core/domain/thread/service/thread.service";
import { CommentService } from "./core/domain/comment/service/comment.service";
import { PhotoService } from "./core/domain/photo/service/photo.service";

const sqlPoolDatabaseInstance = new SqlPoolDatabase(
   new Pool({
      user: "postgres",
      host: "localhost",
      database: "forum",
      port: 5432
   })
)
const hasher = new HashEncrypt

const userServiceInstance = new UserService(hasher, sqlPoolDatabaseInstance);
const threadServiceInstance = new ThreadService(sqlPoolDatabaseInstance);
const commentServiceInstance = new CommentService(sqlPoolDatabaseInstance);
const photoServiceInstance = new PhotoService(sqlPoolDatabaseInstance);

const jsonschemaValidatorInstance = new JsonSchemaValidator;
const localAuthenticatorInstance = new LocalAuthenticator(userServiceInstance, hasher);

export {
   sqlPoolDatabaseInstance as sqlDatabaseInstance,
   userServiceInstance,
   threadServiceInstance,
   commentServiceInstance,
   photoServiceInstance,

   jsonschemaValidatorInstance,
   localAuthenticatorInstance,
}