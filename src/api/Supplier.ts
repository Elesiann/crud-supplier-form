import { ISupplier } from "../types/Supplier.type";
import API from "./Api";

export default class Supplier {
  static async getAll() {
    return new API().get("/supplier").then((response) => {
      if (response.status !== 200) return Promise.reject(response);
      return response.data as ISupplier[];
    });
  }

  static async register(data: ISupplier) {
    return new API().post("/supplier", data).then((response) => {
      if (response.status !== 201) return Promise.reject(response);
      return response.data as ISupplier;
    });
  }

  static async delete(id: number) {
    return new API().delete(`/supplier/${id}`).then((response) => {
      if (response.status !== 200) return Promise.reject(response);
      return response.data;
    });
  }
}
