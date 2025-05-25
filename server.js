const dotenv = require("dotenv");
dotenv.config();
const fastify = require("fastify");
const server = fastify();
const App = require("./src/app");

App(server);

const PORT = process.env.PORT || 3000;

server.listen({ port: PORT }, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log("Server listening on port 3000");
});
