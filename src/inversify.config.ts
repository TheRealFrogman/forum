import { Pool } from "pg";
import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validation/jsonschema-validator.impl";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { CommentService } from "@/core/domain/comment/service/comment.service";
import { PhotoService } from "@/core/domain/photo/service/photo.service";
import { SessionMAPRepository } from "@/adapters/session/SessionRepository";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { SessionService } from "@/core/ports/session/SessionService";
import { Container } from "inversify";
import { ISqlDatabase } from "@/core/ports/database/sql-database.interface";
import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash";
import { ISessionRepository } from "@/core/ports/session/SessionRepository";
import { AccessJwtService } from "@/core/ports/jwt/AccessJwtService";
import { JwtImpl } from "@/adapters/jwt/jwt.impl";
import { RefreshJwtService } from "@/core/ports/jwt/RefreshJwtService";
import { DeleteUser_UseCase } from "@/core/use-cases/user/deleteUser";
import { UpdateUser_UseCase } from "@/core/use-cases/user/updateUser";
import { GetUser_UseCase } from "@/core/use-cases/user/getUser";
import { CreateThread_UseCase } from "@/core/use-cases/thread/createThread";
import { GetAllThreads_UseCase } from "@/core/use-cases/thread/getAllThreads";
import { GetThreadsByUser_UseCase } from "@/core/use-cases/thread/getThreadsByUser";
import { UpdateThread_UseCase } from "@/core/use-cases/thread/updateThread";
import { CreateComment_UseCase } from "@/core/use-cases/comment/createComment";
import { DeleteComment_UseCase } from "@/core/use-cases/comment/deleteComment";
import { GetCommentsByThread_UseCase } from "@/core/use-cases/comment/getCommentsByThread";
import { UpdateComment_UseCase } from "@/core/use-cases/comment/updateComment";
import { GetMainPhotosForThreadIfExists_UseCase } from "@/core/use-cases/photo/getMainPhotoForThreadIfExists";


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

// user use-cases
myContainer.bind(DeleteUser_UseCase).to(DeleteUser_UseCase).inSingletonScope();
myContainer.bind(UpdateUser_UseCase).to(UpdateUser_UseCase).inSingletonScope();
myContainer.bind(GetUser_UseCase).to(GetUser_UseCase).inSingletonScope();

// thread use-cases
myContainer.bind(CreateThread_UseCase).to(CreateThread_UseCase).inSingletonScope();
myContainer.bind(GetAllThreads_UseCase).to(GetAllThreads_UseCase).inSingletonScope();
myContainer.bind(GetThreadsByUser_UseCase).to(GetThreadsByUser_UseCase).inSingletonScope();
myContainer.bind(UpdateThread_UseCase).to(UpdateThread_UseCase).inSingletonScope();

// comment use-cases
myContainer.bind(CreateComment_UseCase).to(CreateComment_UseCase).inSingletonScope();
myContainer.bind(DeleteComment_UseCase).to(DeleteComment_UseCase).inSingletonScope();
myContainer.bind(GetCommentsByThread_UseCase).to(GetCommentsByThread_UseCase).inSingletonScope();
myContainer.bind(UpdateComment_UseCase).to(UpdateComment_UseCase).inSingletonScope();

// photo use-case
// import { GetAllPhotosForThread_UseCase } from "@/core/use-cases/photo/getAllPhotosForThread";
// myContainer.bind(GetAllPhotosForThread_UseCase).to(GetAllPhotosForThread_UseCase).inSingletonScope();
myContainer.bind(GetMainPhotosForThreadIfExists_UseCase).to(GetMainPhotosForThreadIfExists_UseCase).inSingletonScope();
