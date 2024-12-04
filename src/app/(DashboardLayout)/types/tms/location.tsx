import { Item } from "../api";

export type District = {
  name: string;
  code?: string;
  city?: City;
  class_name?: string;
  uuid: string;

  key?: number;
  value?: string;
};

export type City = {
  name: string;
  code?: string;
  class_name?: string;

  uuid: string;
  key?: number;
  value?: string;
};

export type Quarter = {
  pk?: number;
  name: string;
  code?: string;
  district?: District;
  class_name?: string;
  uuid?: string;

  key?: number;
  value?: string;
};
export type ShoppingCenter = {
  pk?: number;
  name?: string;
  city?: Item;
  district?: Item;
  quarter?: Item;
  gps?: string;
  namespace_id?: string;
  bank_agent_code?: string;

  key?: number;
  value?: string;
};

export type Address = {
  quarter?: Quarter;
  district?: District;
  city?: City;
  address?: string | null;
};
