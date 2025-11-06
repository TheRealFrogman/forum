import 'reflect-metadata'
import 'module-alias/register';
process.loadEnvFile(__dirname + "/../.env");

import { myContainer } from "./inversify.config";
import { server } from "./server";
import { GetUser_UseCase } from './core/use-cases/user/getUser';


// const localAuthenticatorInstance = myContainer.get(LocalAuthenticatorService)
// localAuthenticatorInstance.register({ username: "admin", password: "admin123", email: "admin@localhost.com" })
// localAuthenticatorInstance.register({ username: "john", password: "john_doe", email: "john@localhost.com" })
// localAuthenticatorInstance.register({ username: "jane", password: "jane_doe", email: "jane@localhost.com" })

const guuc = myContainer.get(GetUser_UseCase)
guuc.subscribe((getUserEvent) => console.log(getUserEvent.user))

server.listen(process.env['PORT'], () => {
   console.log(`listening ${process.env['PORT']}`)
});