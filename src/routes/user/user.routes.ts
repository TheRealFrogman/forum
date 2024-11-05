import { CreateUserDto } from '@/core/domain/user/dto/create-user.dto';
import { UpdateUserDto } from '@/core/domain/user/dto/update-user.dto';
import { receiveBody } from '@/core/lib/receiveBody';
import http from 'http';

import { jsonschemaValidatorInstance, localAuthenticatorInstance, userServiceInstance } from '@/dependencies';
import { getBasicCredentials } from '@/core/lib/getBasicCredentials';
import { HttpError } from '@/core/exceptions/HttpError';
import { deleteUser_UseCase } from '@/core/domain/use-cases/deleteUser';
import { updateUser_UseCase } from '@/core/domain/use-cases/updateUser';
import { createUser_UseCase } from '@/core/domain/use-cases/createUser';
import { getUser_UseCase } from '@/core/domain/use-cases/getUser';

export async function userRoutes(request: http.IncomingMessage, response: http.ServerResponse) {
   const url = new URL(request.url!, `http://${request.headers.host}`);
   const method = request.method!;

   try {
      switch (method) {
         case 'GET': {
            const id = url.searchParams.get('id') ?? undefined;
            const username = url.searchParams.get('username') ?? undefined;
            await getUser_UseCase(username, id);
         }
         case 'POST': {
            const body = await receiveBody<CreateUserDto>(request);
            const aggregateValidationError = jsonschemaValidatorInstance.validateBySchema(body, CreateUserDto.schema);
            if (aggregateValidationError.length) throw aggregateValidationError;

            return void response.end(JSON.stringify(
               await createUser_UseCase(body as CreateUserDto)
            ));
         }
         case 'PATCH': {
            const creds = getBasicCredentials(request)
            if (!creds) {
               return void response.writeHead(401).end();
            }
            const id = url.searchParams.get('id')!;
            if (!id) {
               return void response.writeHead(400).end();
            }

            const authUser = await localAuthenticatorInstance.authenticate(creds.username, creds.password);
            if (!authUser) throw new HttpError(401);

            const body = await receiveBody<UpdateUserDto>(request);
            const aggregateValidationError = jsonschemaValidatorInstance.validateBySchema(body, UpdateUserDto.schema);
            if (aggregateValidationError.length) throw aggregateValidationError;

            return void response.end(JSON.stringify(
               await updateUser_UseCase(authUser, id, body as UpdateUserDto)
            ));

         }
         case 'DELETE': {
            const creds = getBasicCredentials(request)
            if (!creds) {
               return void response.writeHead(401).end();
            }
            const id = url.searchParams.get('id')!;
            if (!id) {
               return void response.writeHead(400).end();
            }

            const authUser = await localAuthenticatorInstance.authenticate(creds.username, creds.password);
            if (!authUser) throw new HttpError(401);

            return void response.end(JSON.stringify(
               await deleteUser_UseCase(authUser, id)
            ));
         }
         default: {
            return void response.writeHead(405).end();
         }
      }
   } catch (error) {
      if (error instanceof HttpError)
         return void response
            .writeHead(error.httpCode, { 'Content-Type': 'application/json' })
            .end(JSON.stringify(error));

      throw error;
   }

}
