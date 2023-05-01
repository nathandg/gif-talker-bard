import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { Container } from "inversify";

import TalkService from "./services/TalkService.js";
import { IProxy } from "Types/proxyInterface.js";

const container = new Container();

//TalkService
const credentials = process.env.cookies as string;
const proxy: IProxy = {
  proxy: {
    host: process.env.host as string,
    port: parseInt(process.env.port || '8080'),
    auth: {
      username: process.env.username as string,
      password: process.env.password as string,
    },
    protocol: 'http',
  },
};

container
  .bind<TalkService>("TalkService")
  .toConstantValue(new TalkService(credentials, proxy));

export { container };
