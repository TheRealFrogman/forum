import { cookie } from "@/core/lib/setCookie";

export const unsetSessionCookieHeaders = {
   'set-cookie': cookie('session', '', new Date(0), { domain: process.env['DOMAIN'] ?? "localhost", httpOnly: true, secure: true, sameSite: "Strict", maxAge: 0, path: "/" }),
}