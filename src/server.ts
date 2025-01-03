import { Server } from "http";
import app from "./app";
import { local_config } from "./app/config";

let server: Server;

const PORT = local_config.port || 3000;

const main = async () => {
  server = app.listen(PORT, () => {
    console.log("Pomodoro Server Running on port: ", local_config.port);
  });
};

main();
