import { ServerResponse } from "http";

export function cookie(
   key: string,
   value: string,
   expiresAt: Date,
   options: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
      domain?: string;
      path?: string;
      maxAge?: number;
   } = {}
) {
   let cookie = `${key}=${value}; expires=${expiresAt.toUTCString()}; path=/`;
   if (options.httpOnly) {
      cookie += "; httpOnly";
   }
   if (options.secure) {
      cookie += "; secure";
   }
   if (options.sameSite) {
      cookie += "; sameSite=" + options.sameSite;
   }
   if (options.domain) {
      cookie += "; domain=" + options.domain;
   }
   if (options.maxAge) {
      cookie += "; max-age=" + options.maxAge;
   }
   if (options.path) {
      cookie += "; path=" + options.path;
   }

   return cookie;
}

