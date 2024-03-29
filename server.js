import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { usersRouter } from "./routes/index.js";
import connect from "./database/database.js";
import checkToken from "./authentication/auth.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(checkToken); // A safeguard for endpoints
app.use(express.json());
const port = process.env.PORT ?? 3001;

app.use("/users", usersRouter);

const server = app.listen(port, async () => {
  await connect();
  console.log(`listening on port ${port}`);
});

export default server;
