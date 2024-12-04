import { City, District, Quarter, ShoppingCenter } from "../tms/location";
import { MerchantActivity, MerchantType } from "../tms/merchant";

export interface MerchantLocationType {
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | MerchantLocationType
    | MerchantType
    | MerchantActivity
    | City
    | District
    | Quarter
    | Date
    | ShoppingCenter;
  flag: string;
  uuid: string;
  source: string;
  createdDate: string;
  createdUserName: string;
  lastUpdatedDate: string;
  lastUpdatedUserName: string;
  name: string;
  businessName?: string;
  merchant: MerchantType;
  merchantActivity?: MerchantActivity;
  status: string;
  phone: string;
  email: string;
  accountNo: string;
  bankAccountName: string;
  employeeName: string;
  employeePosition: string;
  employeePhone: string;
  financialEmployeeName: string;
  financialEmployeePhone: string;
  imagePath?: string;
  city: City;
  district: District;
  quarter: Quarter;
  address: string;
  gps: string;
  shoppingCenter: ShoppingCenter;
  //   supportGroup?: SupportGroup ;
  //   bankEmployee?: NovaUser ;
  //   namespace?: Namespace ;
  bankAgentCode?: string;
  //   provider?: Provider ;
  is98Config: boolean;
  isPaperLocation: boolean;
  merchantBusinessStartedDate: Date;
  dailyCustomerNumber: number;
  monthlyAverageRevenue: number;
  id: string;
  //   vatService: VatService | null;
  //   productType: POSProductType | null;
}

export interface MerchantLocationEdge {
  cursor: string;
  node: MerchantLocationType;
}

export interface MerchantLocations {
  merchants: {
    edgeCount: number;
    edges: MerchantLocationEdge[];
    totalCount: number;
  };
}
