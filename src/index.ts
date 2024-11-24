import 'reflect-metadata'
import { myContainer } from "./inversify.config";

process.loadEnvFile(__dirname + "/../.env");

const localAuthenticatorInstance = myContainer.get(LocalAuthenticatorService)

localAuthenticatorInstance.register({ username: "admin", password: "admin123", email: "admin@localhost" })
localAuthenticatorInstance.register({ username: "john", password: "john_doe", email: "john@localhost" })
localAuthenticatorInstance.register({ username: "jane", password: "jane_doe", email: "jane@localhost" })

const guuc = myContainer.get(GetUser_UseCase)
guuc.subscribe((getUserEvent) => console.log(getUserEvent.user))

import { server } from "./server";
import { LocalAuthenticatorService } from './core/domain/local-auth/local-auth';
import { GetUser_UseCase } from './core/use-cases/user/getUser';
server.listen(process.env['PORT'], () => {
   console.log(`listening ${process.env['PORT']}`)
});