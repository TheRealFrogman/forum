import { Pool } from "pg";
import { SqlPoolDatabase } from "@/adapters/database/SqlDatabase";
import { UserService } from "@/core/domain/user/service/user.service";
import { HashEncrypt } from "@/adapters/hash-encrypt/hash-encrypt.provider";
import { JsonSchemaValidator } from "@/adapters/jsonschema-validator/jsonschema-validator.impl";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { CommentService } from "@/core/domain/comment/service/comment.service";
import { PhotoService } from "@/core/domain/photo/service/photo.service";
import { SessionMAPRepository } from "@/adapters/session/SessionRepository";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { SessionService } from "@/core/ports/session/SessionService";
import { Container } from "inversify";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash";
import { ISessionRepository } from "@/core/ports/session/SessionRepository";
import { JwtImpl } from "@/adapters/jwt/jwt.impl";
import { DeleteUser_UseCase } from "@/core/use-cases/user/deleteUser";
import { UpdateUser_UseCase } from "@/core/use-cases/user/updateUser";
import { GetUser_UseCase } from "@/core/use-cases/user/getUser";
import { CreateThread_UseCase } from "@/core/use-cases/thread/createThread";
import { GetAllThreads_UseCase } from "@/core/use-cases/thread/getAllThreads";
import { GetThreadsByUser_UseCase } from "@/core/use-cases/thread/getThreadsByAuthor";
import { UpdateThread_UseCase } from "@/core/use-cases/thread/updateThread";
import { CreateComment_UseCase } from "@/core/use-cases/comment/createComment";
import { DeleteComment_UseCase } from "@/core/use-cases/comment/deleteComment";
import { GetCommentsByThread_UseCase } from "@/core/use-cases/comment/getCommentsByThread";
import { UpdateComment_UseCase } from "@/core/use-cases/comment/updateComment";
import { GetMainPhotosForThreadIfExists_UseCase } from "@/core/use-cases/photo/getMainPhotoForThreadIfExists";
import { ISqlDatabaseConnectionBinder } from "./core/ports/database/single-connection-database/ISqlDatabaseConnectionBinder";
import { AccessJwtService } from "./core/ports/jwt/service/AccessJwtService";
import { RefreshJwtService } from "./core/ports/jwt/service/RefreshJwtService";
import { ConfirmEmailJwtService } from "./core/ports/jwt/service/ConfirmEmailJwtService";
import { ForgotPasswordJwtService } from "./core/ports/jwt/service/ForgotPasswordJwtService";
import { IEmailer } from "./core/ports/emailer/IEmailer";
import { Emailer } from "./adapters/emailer/Emailer";
import { CategoryService } from "./core/domain/category/service/category.service";
import { VoteService } from "./core/domain/vote/service/vote.service";
import { GetThreadsParametrised_UseCase } from "./core/use-cases/thread/getThreadsParametrised";
import { PgCursorDatabase } from "./core/ports/database/pg-cursor-database/pg-cursor-database";
import { PaginatedDatabase } from "./core/ports/database/paginated-database/PaginatedDatabase";
import { Login_UseCase } from "./core/use-cases/auth/Login_UseCase";
import { ForgotPasswordSendEmail_UseCase } from "./core/use-cases/auth/ForgotPasswordSendEmail_UseCase";
import { Logout_UseCase } from "./core/use-cases/auth/Logout_UseCase";
import { Register_UseCase } from "./core/use-cases/auth/Register_UseCase";
import { ForgotPasswordUpdatePassword_UseCase } from "./core/use-cases/auth/ForgotPasswordUpdatePassword_UseCase";
import { ConfirmEmail_UseCase } from "./core/use-cases/auth/ConfirmEmail_UseCase";
import { GetCommentsByAuthor_UseCase } from "./core/use-cases/comment/getCommentsByAuthor";
import { FindAllByUserAndThread_UseCase } from "./core/use-cases/vote/FindAllByUserAndThread_UseCase";
import { GetCommentByThreadIdAndLocalId } from "./core/use-cases/comment/getCommentByThreadIdAndLocalId";

process.loadEnvFile(__dirname + "/../.env");

export const myContainer = new Container();

const poolDatabaseInstance = new SqlPoolDatabase(
   new Pool({
      user: process.env['PG_USER']!,
      host: process.env['PG_HOST']!,
      database: "forum",
      port: 5432,
   })
)
myContainer.bind(ISqlDatabase).toConstantValue(poolDatabaseInstance);
myContainer.bind(ISqlDatabaseConnectionBinder).toConstantValue(poolDatabaseInstance);
myContainer.bind(PgCursorDatabase).toConstantValue(poolDatabaseInstance);
myContainer.bind(PaginatedDatabase).toConstantValue(poolDatabaseInstance);

myContainer.bind(AccessJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_ACCESS_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)
myContainer.bind(RefreshJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_REFRESH_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)
myContainer.bind(ConfirmEmailJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_CONFIRM_EMAIL_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)
myContainer.bind(ForgotPasswordJwtService).toConstantValue(
   new JwtImpl({
      secret: process.env['JWT_FORGOT_PASSWORD_SECRET']!,
      signOptions: {},
      verifyOptions: {},
      decodeOptions: {}
   })
)

myContainer.bind(IEmailer).toConstantValue(new Emailer(
   process.env["SMTP_HOST"]!, 
   +process.env["SMTP_PORT"]!, 
   {
      user: process.env["SMTP_USER"]!,
      pass: process.env["P8GrwaKNm8Zt1DtB9B"]!
   }
));

myContainer.bind(CategoryService).to(CategoryService);
myContainer.bind(CommentService).to(CommentService);
myContainer.bind(VoteService).to(VoteService);
myContainer.bind(PhotoService).to(PhotoService);
myContainer.bind(ThreadService).to(ThreadService);
myContainer.bind(UserService).to(UserService);

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
myContainer.bind(GetThreadsParametrised_UseCase).to(GetThreadsParametrised_UseCase).inSingletonScope();

// comment use-cases
myContainer.bind(CreateComment_UseCase).to(CreateComment_UseCase).inSingletonScope();
myContainer.bind(DeleteComment_UseCase).to(DeleteComment_UseCase).inSingletonScope();
myContainer.bind(GetCommentsByThread_UseCase).to(GetCommentsByThread_UseCase).inSingletonScope();
myContainer.bind(UpdateComment_UseCase).to(UpdateComment_UseCase).inSingletonScope();
myContainer.bind(GetCommentsByAuthor_UseCase).to(GetCommentsByAuthor_UseCase).inSingletonScope();
myContainer.bind(GetCommentByThreadIdAndLocalId).to(GetCommentByThreadIdAndLocalId).inSingletonScope();

//auth use-cases
myContainer.bind(Login_UseCase).to(Login_UseCase).inSingletonScope();
myContainer.bind(ForgotPasswordSendEmail_UseCase).to(ForgotPasswordSendEmail_UseCase).inSingletonScope();
myContainer.bind(ForgotPasswordUpdatePassword_UseCase).to(ForgotPasswordUpdatePassword_UseCase).inSingletonScope();
myContainer.bind(Logout_UseCase).to(Logout_UseCase).inSingletonScope();
myContainer.bind(Register_UseCase).to(Register_UseCase).inSingletonScope();
myContainer.bind(ConfirmEmail_UseCase).to(ConfirmEmail_UseCase).inSingletonScope();
// photo use-case
// import { GetAllPhotosForThread_UseCase } from "@/core/use-cases/photo/getAllPhotosForThread";
// myContainer.bind(GetAllPhotosForThread_UseCase).to(GetAllPhotosForThread_UseCase).inSingletonScope();
myContainer.bind(GetMainPhotosForThreadIfExists_UseCase).to(GetMainPhotosForThreadIfExists_UseCase).inSingletonScope();


//vote use-cases
myContainer.bind(FindAllByUserAndThread_UseCase).to(FindAllByUserAndThread_UseCase).inSingletonScope();
