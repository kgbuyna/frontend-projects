import { MerchantLocationType } from "./merchantLocation";

export interface TerminalType {
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | ProductType
    | MerchantLocationType;
  flag: string;
  uuid: string;
  source: string;
  createdDate: string;
  createdUserName: string;
  lastUpdatedDate: string;
  lastUpdatedUserName: string;
  name: string;
  idBank: string;
  bankMerchantId: string;
  trc: string;
  accountNo: string;
  pin: string;
  hasPinEntry: boolean;
  isActive: boolean;
  isBlocked: boolean;
  blockedNote?: string;
  logLevel: string;
  agentFlag?: string;
  parentTerminalId?: string;
  terminalType: string;
  macAddress: string;
  readerId: string;
  reservedField1?: string;
  reservedField2?: string;
  address: string;
  gps: string;
  simImsi?: string;
  applicationVersion: number;
  dbConnectionVersion?: string;
  posFirmware?: string;
  contractNo?: string;
  registrationRequestId?: string;
  requestNo: string;
  id: string;
  sourceDisplay: string;
  flagDisplay: string;
  productType: ProductType;
  merchantLocation: MerchantLocationType;
}

export interface Terminals {
  terminals: {
    totalCount: number;
    edgeCount: number;
    edges: TerminalEdge[];
    pageInfo: PageInfo;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface TerminalEdge {
  cursor: string;
  node: TerminalType;
}

export interface ProductType {
  flag: string;
  uuid: string;
  source: string;
  createdDate: string;
  createdUserName: string;
  lastUpdatedDate: string;
  lastUpdatedUserName: string;
  code: string;
  name: string;
  posType: string;
  isActive: boolean;
  isHome: boolean;
  id: string;
  sourceDisplay: string;
  flagDisplay: string;
}
