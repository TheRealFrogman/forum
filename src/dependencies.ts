import { Pool } from "pg";
import { SqlDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validation/jsonschema-validator.impl";
import { LocalAuthenticator } from "@/core/auth/local/local-auth";
import { JwtImpl } from "./adapters/jwt/jwt.impl";

const sqlDatabaseInstance = new SqlDatabase(
   new Pool({
      user: "postgres",
      host: "localhost",
      database: "forum",
      port: 5432
   })
)
const hasher = new HashEncrypt
const userServiceInstance = new UserService(hasher, sqlDatabaseInstance);
const jsonschemaValidatorInstance = new JsonSchemaValidator;
const localAuthenticatorInstance = new LocalAuthenticator(userServiceInstance, hasher);

export {
   sqlDatabaseInstance,
   userServiceInstance,
   jsonschemaValidatorInstance,
   localAuthenticatorInstance
}