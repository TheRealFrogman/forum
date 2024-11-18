import { Pool } from "pg";
import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validation/jsonschema-validator.impl";
import { LocalAuthenticatorService } from "@/core/ports/local-auth/local-auth";
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

myContainer.bind<UserService>(UserService).to(UserService);
myContainer.bind<ThreadService>(ThreadService).to(ThreadService);
myContainer.bind<CommentService>(CommentService).to(CommentService);
myContainer.bind<PhotoService>(PhotoService).to(PhotoService);

myContainer.bind<IEncryptHash>(IEncryptHash).to(HashEncrypt);
myContainer.bind<IJsonschemaValidator>(IJsonschemaValidator).to(JsonSchemaValidator);
myContainer.bind<LocalAuthenticatorService>(LocalAuthenticatorService).to(LocalAuthenticatorService);

myContainer.bind<ISessionRepository>(ISessionRepository).to(SessionMAPRepository);
myContainer.bind<SessionService>(SessionService).to(SessionService);