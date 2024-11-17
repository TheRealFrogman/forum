import { jsonschemaValidatorInstance, localAuthenticatorInstance, sessionServiceInstance, userServiceInstance } from "@/dependencies";
import { Routes } from "./routes";
import { receiveBody } from "@/core/lib/receiveBody";
import { CreateUserDto } from "@/core/domain/user/dto/create-user.dto";
import { parseCookies } from "@/core/lib/parseCookies";
import { UUID } from "crypto";
import { LoginDto } from "@/core/auth/local/login.dto";
import { cookie } from "@/core/lib/setCookie";
import { Session } from "@/core/ports/session/Session";
import { unsetSessionCookieHeaders } from "./reused-code/headers/unsetSessionCookie.headers";
import { getSessionUser } from "./reused-code/helpers/getSessionUser.helper";
import { parseAndValidateBody } from "./reused-code/helpers/parseAndValidateBody.helper";

export const authRoutes: Routes<"/auth/me" | "/auth/logout" | "/auth/login" | "/auth/register"> = {
   ["/auth/me"]: {
      GET: async (request) => {
         return { statusCode: 200, responseModel: JSON.parse(JSON.stringify(getSessionUser(request))) };
      }
   },
   ["/auth/logout"]: {
      POST: async (request) => {
         const sessionId = Session.getIdFromCookie(request);
         const session = await sessionServiceInstance.getSessionBySessionId(sessionId)
         if (!session)
            return {
               statusCode: 401,
               statusMessage: "Invalid session",
               headers: { ...unsetSessionCookieHeaders },
            }

         await sessionServiceInstance.destroySession(session);

         return {
            statusCode: 200,
            headers: { ...unsetSessionCookieHeaders },
         };
      }
   },
   ["/auth/login"]: {
      POST: async (request) => {
         const body = await parseAndValidateBody<LoginDto>(request, LoginDto.schema);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const user = await localAuthenticatorInstance.authenticate(body.username, body.password);
         if (!user)
            return { statusCode: 401 };

         const session = await sessionServiceInstance.createSessionForUser(user);
         return {
            statusCode: 200,
            headers: {
               'set-cookie': cookie('session', session.toString(), new Date(Date.now() + 1000 * 60 * 5), { domain: process.env['DOMAIN'] ?? "localhost", httpOnly: true, secure: true, sameSite: "Strict", maxAge: 31536000, path: "/" }),
            },
         }
      }
   },
   ["/auth/register"]: {
      POST: async (request) => {
         const body = await parseAndValidateBody<CreateUserDto>(request, CreateUserDto.schema);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const newUser = await localAuthenticatorInstance.register(body.username, body.password);
         if (!newUser)
            return { statusCode: 409 };

         return { statusCode: 201, responseModel: newUser }
      }
   },
} 