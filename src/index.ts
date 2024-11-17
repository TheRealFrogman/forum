process.loadEnvFile(__dirname + "/../.env");

import { localAuthenticatorInstance } from "./dependencies";

localAuthenticatorInstance.register("admin", "admin123")
localAuthenticatorInstance.register("john", "john_doe")
localAuthenticatorInstance.register("jane", "jane_doe")

import { server } from "./server";
server.listen(process.env['PORT'], () => {
   console.log(`listening ${process.env['PORT']}`)
});