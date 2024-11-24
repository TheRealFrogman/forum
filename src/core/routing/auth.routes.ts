import { RegisterDto } from "@/core/domain/local-auth/dto/register.dto";
import { LoginDto } from "@/core/domain/local-auth/dto/login.dto";
import { cookie } from "@/core/lib/setCookie";
import { Session } from "@/core/ports/session/Session";
import { receiveBody } from "@/core/lib/receiveBody";
import { Routes } from "@/core/routing/routes";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";
import { unsetSessionCookieHeaders } from "@/core/routing/reused-code/headers/unsetSessionCookie.headers";

import { myContainer } from "@/inversify.config";

import { SessionService } from "@/core/ports/session/SessionService";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { ForgotPasswordDto } from "../domain/local-auth/dto/forgot-password.dto";
import { ForgotPasswordSendEmail_UseCase } from "../use-cases/auth/ForgotPasswordSendEmail_UseCase";
import { isToken } from "../ports/jwt/TToken";
import { ForgotPasswordJwtService } from "../ports/jwt/service/ForgotPasswordJwtService";
import { UserService } from "../domain/user/service/user.service";
import { ForgotPasswordUpdatePassword_UseCase } from "../use-cases/auth/ForgotPasswordUpdatePassword_UseCase";
import { UpdateForgottenPasswordDto } from "../domain/local-auth/dto/update-forgotten-password.dto";

const sessionServiceInstance = myContainer.get(SessionService);
const localAuthenticatorInstance = myContainer.get(LocalAuthenticatorService);
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator);

export const authRoutes: Routes<"/auth/me" | "/auth/logout" | "/auth/login" | "/auth/register" | "/auth/forgot-password"> = {
   ["/auth/me"]: {
      GET: async (request) => {
         const user = await getSessionUser(request)
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         return { statusCode: 200, responseModel: JSON.parse(JSON.stringify(user)) };
      }
   },
   ["/auth/logout"]: {
      POST: async (request) => {
         let session: Session | null = null;

         const sessionId = Session.getIdFromCookie(request);

         if (sessionId && (session = await sessionServiceInstance.getSession(sessionId))) {
            await sessionServiceInstance.destroySession(session);
            return {
               statusCode: 200,
               statusMessage: "Session destroyed",
               headers: { ...unsetSessionCookieHeaders },
            };
         } else
            return {
               statusCode: 401,
               statusMessage: "Invalid session",
               headers: { ...unsetSessionCookieHeaders },
            }

      }
   },
   ["/auth/login"]: {
      POST: async (request) => {
         const body = await receiveBody<LoginDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<LoginDto>(body, LoginDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         const user = await localAuthenticatorInstance.authenticate(validatedBody);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid credentials" };

         const session = await sessionServiceInstance.createSessionForUser(user);
         return {
            statusCode: 200,
            headers: {
               'set-cookie': cookie('session', session.sessionId, new Date(Date.now() + 1000 * 60 * 5), { domain: process.env['DOMAIN'] ?? "localhost", httpOnly: true, secure: true, sameSite: "Strict", maxAge: 31536000, path: "/" }),
            },
         }
      }
   },
   ["/auth/register"]: {
      POST: async (request) => {
         const body = await receiveBody<RegisterDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<RegisterDto>(body, RegisterDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         const user = await localAuthenticatorInstance.register(validatedBody);
         if (!user)
            return { statusCode: 409, statusMessage: "User already exists" };

         return { statusCode: 201, responseModel: user, statusMessage: "User created" }
      }
   },
   ["/auth/forgot-password"]: {
      POST: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const token = url.searchParams.get('token');

         const body = await receiveBody<ForgotPasswordDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         if (token /** if has token */) {
            if (!isToken(token))
               return { statusCode: 400, statusMessage: "Invalid token" }

            const forgotPasswordJwtServiceInstance = myContainer.get(ForgotPasswordJwtService);       // чтобы понять какой юзер перешел по ссылке нам нужно задекодить jwt
            const { userId } = await forgotPasswordJwtServiceInstance.verify(token);
            const userServiceInstance = myContainer.get(UserService);
            const user = await userServiceInstance.findOneById(userId);
            if (!user)
               return { statusCode: 404, statusMessage: "User not found" }

            const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<UpdateForgottenPasswordDto>(body, UpdateForgottenPasswordDto.schema);
            if (error)
               return { statusCode: 400, statusMessage: error.message, responseModel: error }

            return myContainer.get(ForgotPasswordUpdatePassword_UseCase).execute(user, validatedBody.password)
         } else {
            const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<ForgotPasswordDto>(body, ForgotPasswordDto.schema);
            if (error)
               return { statusCode: 400, statusMessage: error.message, responseModel: error }

            return myContainer.get(ForgotPasswordSendEmail_UseCase).execute(validatedBody.email)
         }
      }
   }
} 