const dotenv = require("dotenv");
dotenv.config();
const fastify = require("fastify");
const server = fastify();
const App = require("./src/app");

App(server);

server.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log('Server listening on port 3000');
});
