process.loadEnvFile(__dirname + "/../.env");

import { userServiceInstance } from "./dependencies";

userServiceInstance.create({ password: "admin123", username: "admin" })
   .catch(() => { });
userServiceInstance.create({ password: "john_doe", username: "john" })
   .catch(() => { });
userServiceInstance.create({ password: "jane_doe", username: "jane" })
   .catch(() => { });

import { server } from "./server";
server.listen(process.env['PORT'], () => {
   console.log(`listening ${process.env['PORT']}`)
});