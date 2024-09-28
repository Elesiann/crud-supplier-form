import ExternalApi from "./External";

export default class Google {
  static async getUserInfo(access_token: string) {
    return new ExternalApi()
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`)
      .then((response) => {
        if (response.status !== 200) return Promise.reject(response);
        return response.data;
      });
  }
}
