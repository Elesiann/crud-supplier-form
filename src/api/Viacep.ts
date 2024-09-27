import ExternalApi from "./External";

export default class ViaCep {
  static async getZipCode(zipCode: string) {
    return new ExternalApi().get(`https://viacep.com.br/ws/${zipCode}/json/`).then((response) => {
      if (response.status !== 200) return Promise.reject(response);
      return response.data;
    });
  }
}
