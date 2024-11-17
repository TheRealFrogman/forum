import http from "http";

export function parseCookies(request: http.IncomingMessage) {
   const list: { [key: string]: string | void } = {};
   const cookieHeader = request.headers?.cookie;
   if (!cookieHeader) return list;

   cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
   });

   return list;
}