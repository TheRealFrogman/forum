import { IncomingMessage } from "http";

export const getBasicCredentials = (request: IncomingMessage) => {
   if (!request.headers.authorization) return null;

   const parts = request.headers.authorization.split(' ');

   if (parts[0] !== 'Basic') return null;
   if (parts.length !== 2) return null;

   const credentials = parts[1];

   const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')

   return { username, password };
};
