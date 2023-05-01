import express, { Application, Request, Response, NextFunction } from "express";
import * as url from "url";
import * as path from "path";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { TalkRouter } from "./routes/Talk.route.js";
const app: Application = express();

app.use("/talk", TalkRouter);

//static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  const file = path.join(__dirname, "/public/views/index.html");
  res.sendFile(file);
});

export default app;
