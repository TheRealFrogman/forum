import http from 'http';

export async function authGetMe(request: http.IncomingMessage, response: http.ServerResponse) {
   const url = new URL(request.url!, `http://${request.headers.host}`);
   const method = request.method!;


   
}
