export class IProxy {
  proxy?: {
      host: string;
      port: number;
      auth?: {
          username: string;
          password: string;
      };
      protocol?: "http" | "https";
  };
}