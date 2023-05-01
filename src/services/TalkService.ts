import { injectable } from "inversify";
import { Bard } from "googlebard";
import { IProxy } from "../Types/proxyInterface.js";

@injectable()
class TalkService {
  private bard: any;

  constructor(private credentials: string, private proxy: IProxy) {
    (async () => {
      this.bard = new Bard(credentials, proxy);
    })();
  }

  async ask(prompt: string, conversationId?: string) {
    return await this.bard.ask(prompt, conversationId);
  }
}

export default TalkService;
