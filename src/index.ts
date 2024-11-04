import http from 'http';
import { HttpError } from './core/exceptions/HttpError';
import { userRoutes } from './routes/user/user.routes';

import { userServiceInstance } from './dependencies';
userServiceInstance.create({ password: "admin123", username: "admin" })
   .catch(() => { });
userServiceInstance.create({ password: "john_doe", username: "john" })
   .catch(() => { });
userServiceInstance.create({ password: "jane_doe", username: "jane" })
   .catch(() => { });

const server = http.createServer(async (request, response) => {
   const url = new URL(request.url!, `http://${request.headers.host}`);

   try {
      switch (url.pathname) {
         case '/users': {
            const result = await userRoutes(request, response);
            
            break;
         }
      }
   } catch (error) {
      if (error instanceof HttpError)
         return void response
            .writeHead(error.httpCode, { 'Content-Type': 'application/json' })
            .end(JSON.stringify(error));

      throw error;
   }
});

server.listen(3000, () => {
   console.log('Server running on port 3000');
});