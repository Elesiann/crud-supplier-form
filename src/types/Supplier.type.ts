export interface IContact {
  name: string;
  phone: string;
}

export interface IAddress {
  zipCode: string;
  state: string;
  city: string;
  street: string;
  number: number;
  reference?: string;
}

export interface ISupplier {
  id: number;
  name: string;
  description: string;
  contacts: IContact[];
  address: IAddress;
}
