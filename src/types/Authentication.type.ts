export interface IAuthentication {
  email: string;
  password: string;
  name?: string;
}

export enum AuthenticationType {
  LOGIN = "login",
  REGISTER = "register"
}
