import { RegisterDto } from "@/core/domain/local-auth/dto/register.dto";
import { LoginDto } from "@/core/domain/local-auth/dto/login.dto";
import { Session } from "@/core/ports/session/Session";
import { receiveBody } from "@/core/lib/receiveBody";
import { Routes } from "@/core/routing/routes";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";
import { unsetSessionCookieHeaders } from "@/core/routing/reused-code/headers/unsetSessionCookie.headers";

import { myContainer } from "@/inversify.config";

import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { ForgotPasswordDto } from "../domain/local-auth/dto/forgot-password.dto";
import { ForgotPasswordSendEmail_UseCase } from "../use-cases/auth/ForgotPasswordSendEmail_UseCase";
import { isToken } from "../ports/jwt/Token";
import { ForgotPasswordJwtService } from "../ports/jwt/service/ForgotPasswordJwtService";
import { UserService } from "../domain/user/service/user.service";
import { ForgotPasswordUpdatePassword_UseCase } from "../use-cases/auth/ForgotPasswordUpdatePassword_UseCase";
import { UpdateForgottenPasswordDto } from "../domain/local-auth/dto/update-forgotten-password.dto";
import { Login_UseCase } from "../use-cases/auth/Login_UseCase";
import { Logout_UseCase } from "../use-cases/auth/Logout_UseCase";
import { Register_UseCase } from "../use-cases/auth/Register_UseCase";
import { ConfirmEmailJwtService } from "../ports/jwt/service/ConfirmEmailJwtService";
import { ConfirmEmail_UseCase } from "../use-cases/auth/ConfirmEmail_UseCase";

const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator);

export const authRoutes: Routes<"/auth/me" | "/auth/logout" | "/auth/login" | "/auth/register" | "/auth/forgot-password" | "/auth/confirm-email"> = {
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
         const sessionId = Session.getIdFromCookie(request);

         if (!sessionId)
            return {
               statusCode: 401,
               statusMessage: "Invalid session",
               headers: { ...unsetSessionCookieHeaders },
            }

         return myContainer.get(Logout_UseCase).execute(sessionId);
      }
   },
   ["/auth/login"]: {
      POST: async (request) => {
         const body = await receiveBody<LoginDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchema<LoginDto>(body, LoginDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return myContainer.get(Login_UseCase).execute(validatedBody);
      }
   },
   ["/auth/register"]: {
      POST: async (request) => {
         const body = await receiveBody<RegisterDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchema<RegisterDto>(body, RegisterDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return myContainer.get(Register_UseCase).execute(validatedBody);
      }
   },
   ["/auth/forgot-password"]: {
      POST: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const token = url.searchParams.get('token');

         if (!token) {
            const body = await receiveBody<ForgotPasswordDto>(request);
            if (!body)
               return { statusCode: 400, statusMessage: "No body" };
            const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchema<ForgotPasswordDto>(body, ForgotPasswordDto.schema);
            if (error)
               return { statusCode: 400, statusMessage: error.message, responseModel: error }

            return myContainer.get(ForgotPasswordSendEmail_UseCase).execute(validatedBody.email)
         }
         if (!isToken(token))
            return { statusCode: 400, statusMessage: "Invalid token" }

         const tokenPayload = await myContainer.get(ForgotPasswordJwtService).verify(token); // чтобы понять какой юзер перешел по ссылке нам нужно задекодить jwt
         if (!tokenPayload)
            return { statusCode: 400, statusMessage: "Invalid token" }
         const { userId } = tokenPayload;

         const user = await myContainer.get(UserService).findOneById(userId);
         if (!user)
            return { statusCode: 404, statusMessage: "User not found" };

         const body = await receiveBody<UpdateForgottenPasswordDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };
         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchema<UpdateForgottenPasswordDto>(body, UpdateForgottenPasswordDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return myContainer.get(ForgotPasswordUpdatePassword_UseCase).execute(user, validatedBody.password)
      }
   },
   ["/auth/confirm-email"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const token = url.searchParams.get('token');

         if (!token || !isToken(token))
            return { statusCode: 400, statusMessage: "Invalid token" }

         const tokenPayload = await myContainer.get(ConfirmEmailJwtService).verify(token);
         if (!tokenPayload)
            return { statusCode: 400, statusMessage: "Invalid token" }

         const userId = tokenPayload.userId;
         return myContainer.get(ConfirmEmail_UseCase).execute(userId);
      }
   }
}

