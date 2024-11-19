import { Pool } from "pg";
import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validation/jsonschema-validator.impl";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { ThreadService } from "./core/domain/thread/service/thread.service";
import { CommentService } from "./core/domain/comment/service/comment.service";
import { PhotoService } from "./core/domain/photo/service/photo.service";
import { SessionMAPRepository } from "./adapters/session/SessionRepository";
import { IJsonschemaValidator } from "./core/ports/jsonschema-validation/jsonschema-validator.interface";
import { SessionService } from "./core/ports/session/SessionService";
import { Container } from "inversify";
import { ISqlDatabase } from "./core/ports/database/sql-database.interface";
import { IEncryptHash } from "./core/ports/hash-encrypt/IEncryptHash";
import { ISessionRepository } from "./core/ports/session/SessionRepository";
import { AccessJwtService } from "./core/ports/jwt/AccessJwtService";
import { JwtImpl } from "./adapters/jwt/jwt.impl";
import { RefreshJwtService } from "./core/ports/jwt/RefreshJwtService";
import { DeleteUser_UseCase } from "./core/domain/use-cases/user/deleteUser";
import { UpdateUser_UseCase } from "./core/domain/use-cases/user/updateUser";
import { GetUser_UseCase } from "./core/domain/use-cases/user/getUser";


export const myContainer = new Container();

myContainer.bind<ISqlDatabase>(ISqlDatabase).toConstantValue(
   new SqlPoolDatabase(
      new Pool({
         user: "postgres",
         host: "localhost",
         database: "forum",
         port: 5432
      })
   )
);

myContainer.bind<AccessJwtService>(AccessJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_ACCESS_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)
myContainer.bind<RefreshJwtService>(RefreshJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_REFRESH_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)

myContainer.bind(UserService).to(UserService);
myContainer.bind(ThreadService).to(ThreadService);
myContainer.bind(CommentService).to(CommentService);
myContainer.bind(PhotoService).to(PhotoService);

myContainer.bind(IEncryptHash).to(HashEncrypt);
myContainer.bind(IJsonschemaValidator).to(JsonSchemaValidator);
myContainer.bind(LocalAuthenticatorService).to(LocalAuthenticatorService);

myContainer.bind(ISessionRepository).to(SessionMAPRepository);
myContainer.bind(SessionService).to(SessionService);

myContainer.bind(DeleteUser_UseCase).to(DeleteUser_UseCase);
myContainer.bind(UpdateUser_UseCase).to(UpdateUser_UseCase);
myContainer.bind(GetUser_UseCase).to(GetUser_UseCase);