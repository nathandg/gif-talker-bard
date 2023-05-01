import { Request, Response } from "express";
import "reflect-metadata";

import { injectable, inject } from "inversify";
import TalkService from "../services/TalkService.js";

@injectable()
class TalkController {
  constructor(
    @inject("TalkService")
    private talkService: TalkService
  ) {}

  public talk(req: Request, res: Response): void {
    this.talkService
      .ask(req.query.prompt as string, 'trump')
      .then((response) => {
        res.json(response).status(200);
      })
      .catch((error) => {
        res.json(error).status(500);
      });
  }
}

export default TalkController;
