import { receiveBody } from "@/core/lib/receiveBody";
import { jsonschemaValidatorInstance } from "@/dependencies";
import { IncomingMessage } from "http";

export async function parseAndValidateBody<T extends object>(request: IncomingMessage, schema: object): Promise<T | null> {
   const body = await receiveBody<T>(request);
   if (!body)
      return null;

   jsonschemaValidatorInstance.assertBySchemaOrThrow<T>(body, schema);
   return body;
}