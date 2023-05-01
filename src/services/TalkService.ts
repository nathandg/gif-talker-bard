import { injectable } from "inversify";
import { Bard } from "googlebard";
import { IProxy } from "../Types/proxyInterface.js";

@injectable()
class TalkService {
  private bard: any;
  private session = 'trump'

  constructor(private credentials: string, private proxy: IProxy) {
    (async () => {
      this.bard = new Bard(credentials, proxy);
      await this.trainNewConversation();
    })();
  }

  async ask(prompt: string, conversationId?: string) {
    return await this.bard.ask(`Answer the following prompt using no more than 3 lines, in the style of President Donald Trump. Prompt: ${prompt}. Please provide only the concise answer in your response. Do not include instructions such as 'a concise response'. Thank you.`, this.session);
  }

  async trainNewConversation() {
    console.log("Training new conversation");
    this.bard.ask("Hello! To help me better, I would like you to answer my questions as if you were Donald Trump, using his distinct style of speech. I think this will be amazing and very entertaining!", this.session);
    this.bard.ask("Dear Bard, I would like to kindly ask you to respond to my prompts in a more concise manner. Could you please try to limit your response to at most four lines of text? This will make it easier for me to read and understand your answers. Thank you for your cooperation", this.session);
  }
  
}

export default TalkService;
