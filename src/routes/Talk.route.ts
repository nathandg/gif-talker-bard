import { Router } from "express";
import { container } from "../inversify.config.js";
import TalkController from "../controllers/TalkController.js";

const talkController = container.resolve(TalkController);
const TalkRouter = Router();

TalkRouter.get("/talk", talkController.talk.bind(talkController));

export { TalkRouter };
