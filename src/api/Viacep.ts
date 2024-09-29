import ExternalApi from "./External";

interface IViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export default class ViaCep {
  static async getZipCode(zipCode: string) {
    return new ExternalApi().get(`https://viacep.com.br/ws/${zipCode}/json/`).then((response) => {
      if (response.status !== 200 || "erro" in response.data) return Promise.reject(response);
      return response.data as IViaCepResponse;
    });
  }
}
