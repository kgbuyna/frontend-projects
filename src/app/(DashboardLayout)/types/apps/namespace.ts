import { City, District } from "../tms/location";

export interface NamespaceType {
  uuid?: string | null;
  source?: string | null;
  sourceDisplay?: string | null;

  userType: string | null;
  userTypeDisplay?: string | null;

  name: string | null;
  nameShort?: string | null;
  companyPhone?: string | null;

  city: City;
  district: District;
  address?: string | null;

  managerName?: string | null;
  managerPhone?: string | null;
  managerEmail?: string | null;

  developerName?: string | null;
  developerPhone?: string | null;
  developerEmail?: string | null;

  createdDate?: Date | null;
  lastUpdatedDate?: Date | null;
  createdUserName?: string | null;
  lastUpdatedUserName?: string | null;
  statusDisplay?: string | null;

  status?: string | null;

  callCenterPhone?: string | null;
}

export interface NamespaceEdge {
  cursor: string;
  node: NamespaceType;
}
