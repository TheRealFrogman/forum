import { jsonschemaValidatorInstance, localAuthenticatorInstance, sessionServiceInstance } from "@/dependencies";
import { CreateUserDto } from "@/core/domain/user/dto/create-user.dto";
import { LoginDto } from "@/core/auth/local/login.dto";
import { cookie } from "@/core/lib/setCookie";
import { Session } from "@/core/ports/session/Session";
import { receiveBody } from "@/core/lib/receiveBody";
import { Routes } from "../routes";
import { getSessionUser } from "../reused-code/helpers/getSessionUser.helper";
import { unsetSessionCookieHeaders } from "../reused-code/headers/unsetSessionCookie.headers";

export const authRoutes: Routes<"/auth/me" | "/auth/logout" | "/auth/login" | "/auth/register"> = {
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

         const user = await localAuthenticatorInstance.authenticate(validatedBody.username, validatedBody.password);
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
         const body = await receiveBody<CreateUserDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<CreateUserDto>(body, CreateUserDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         const user = await localAuthenticatorInstance.register(validatedBody.username, validatedBody.password);
         if (!user)
            return { statusCode: 409, statusMessage: "User already exists" };

         return { statusCode: 201, responseModel: user, statusMessage: "User created" }
      }
   },
} 