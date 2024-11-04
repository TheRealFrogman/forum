import { IncomingMessage } from "http"

// можно сделать ошибку если неправильный синтакс json
// 
export function receiveBody<TMaybe extends object>(request: IncomingMessage){
   return new Promise<Record<keyof TMaybe, unknown>>(async (resolve, reject) => {
      let chunks = [];
      for await (const chunk of request) chunks.push(chunk)
      const data = Buffer.concat(chunks).toString();
      resolve(data ? JSON.parse(data) : null);
   })
}
