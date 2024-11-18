import 'reflect-metadata'
import { myContainer } from "./inversify.config";

process.loadEnvFile(__dirname + "/../.env");

const localAuthenticatorInstance = myContainer.get(LocalAuthenticatorService)

localAuthenticatorInstance.register("admin", "admin123")
localAuthenticatorInstance.register("john", "john_doe")
localAuthenticatorInstance.register("jane", "jane_doe")

import { server } from "./server";
import { LocalAuthenticatorService } from './core/ports/local-auth/local-auth';
server.listen(process.env['PORT'], () => {
   console.log(`listening ${process.env['PORT']}`)
});