const dotenv = require("dotenv");
dotenv.config();
const fastify = require("fastify");
const server = fastify();
const App = require("./src/app");

App(server);

server.listen(`${process.env.PORT}`, () => {
  console.log("listening on port " + process.env.PORT);
});
