import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class API {
  readonly request: AxiosInstance;

  constructor() {
    this.request = axios.create();
  }

  async get(path: string, config?: AxiosRequestConfig) {
    return await this.request.get(path, config).catch((err) => {
      console.error("[API:GET]", err);
      return err;
    });
  }

  async post(path: string, data: any, config?: AxiosRequestConfig) {
    return await this.request.post(path, data, config).catch((err) => {
      console.error("[API:POST]", err);
      return err;
    });
  }

  async put(path: string, data: any, config?: AxiosRequestConfig) {
    return await this.request.put(path, data, config).catch((err) => {
      console.error("[API:PUT]", err);
      return err;
    });
  }

  async delete(path: string, config?: AxiosRequestConfig) {
    return await this.request.delete(path, config).catch((err) => {
      console.error("[API:DELETE]", err);
      return err;
    });
  }

  async patch(path: string, data?: any, config?: AxiosRequestConfig) {
    return await this.request.patch(path, data, config).catch((err) => {
      console.error("[API:DELETE]", err);
      return err;
    });
  }
}

export default API;
