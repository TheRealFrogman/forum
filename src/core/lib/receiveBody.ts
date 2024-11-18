import { IncomingMessage } from "http"

export async function receiveBody<TMaybe extends object>(request: IncomingMessage): Promise<Record<keyof TMaybe, unknown> | null> {
   let chunks = [];
   for await (const chunk of request) chunks.push(chunk)
   const data = Buffer.concat(chunks).toString();

   try {
      return (data ? JSON.parse(data) : null) as (Record<keyof TMaybe, unknown> | null);
   } catch (error) {
      return null;
   }
}
