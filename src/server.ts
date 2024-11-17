import http from "http"

import { userRoutes } from "./routes/user-routes"
import { HttpError } from "./core/exceptions/HttpError"
import { authRoutes } from "./routes/auth.routes"


export const server = http.createServer({}, async (request, response) => {
   if (!request.url || !request.method)
      return void response.writeHead(400, "No url or method").end()


   const url = new URL(request.url, `http://${request.headers.host}`);
   console.log(request.method, url.pathname);
   try {
      if (url.pathname === "/test")
         return void request.pipe(response)

      const allRoutes = {
         ...userRoutes,
         ...authRoutes,
      }
      if (!(url.pathname in allRoutes))
         return void response.writeHead(404, "Route not found").end()
      const route = allRoutes[url.pathname as keyof typeof allRoutes];

      if (!(request.method in route))
         return void response.writeHead(405).end()

      const service = route[request.method as keyof typeof route]!;
      const result = await service(request);

      response
         .writeHead(result.statusCode, result.statusMessage, result.headers)
         .end(result.responseModel ? JSON.stringify(result.responseModel) : undefined);

   } catch (error) {
      if (error instanceof HttpError)
         return void response
            .writeHead(error.httpCode, error.message, { 'Content-Type': 'application/json' })
            .end(JSON.stringify(error));

      console.error(error);
      return void response
         .writeHead(500, { 'Content-Type': 'application/json' })
         .end()
   }
})

