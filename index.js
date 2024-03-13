const express = require("express");
const { Client } = require("pg");
const usersRouter = require("./routes/users");
const employeesRouter = require("./routes/employees");

const app = express();

const client = new Client({
  user: "didico",
  password: "boquetinho",
});

client.connect();

app.use(express.json());

usersRouter(app, client);
employeesRouter(app, client);

app.listen(3005, () => console.log("servidor rodando"));
