import axios, { AxiosInstance } from "axios";

export default class ExternalApi {
  readonly request: AxiosInstance;

  constructor() {
    this.request = axios.create();
  }

  async get(url: string) {
    return await this.request.get(url).catch((err) => {
      console.error("[API:GET]", err);
      return err;
    });
  }
}
