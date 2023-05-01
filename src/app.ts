import express, { Application, Request, Response, NextFunction } from "express";

import { TalkRouter } from "./routes/Talk.route.js";
const app: Application = express();

app.use("/talk", TalkRouter);

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ healtzh: true });
});

export default app;
