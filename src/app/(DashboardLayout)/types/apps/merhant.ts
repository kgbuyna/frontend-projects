export interface MerchantType {
  [key: string]: any;
  flag: string;
  uuid: string;
  source: string;
  createdDate: string;
  createdUserName: string;
  lastUpdatedDate: string;
  lastUpdatedUserName: string;
  status: string;
  bankMerchantId?: string;
  merchantType: "ORGANIZATION" | "PERSON";
  merchantRating: string;
  companyName: string;
  companyNameShort?: string;
  companyStateCertificationNo: string;
  companyRegisterNo: string;
  companyType: string;
  personFirstName?: string;
  personLastName?: string;
  personRegisterNo?: string;
  personNationality?: string;
  nameLatin?: string;
  businessType?: string;
  merchantBusinessStartedDate?: string;
  dailyCustomerNumber?: string;
  monthlyAverageRevenue: string;
  phone1: string;
  phone2: string;
  phoneSms: string;
  email: string;
  address: string;
  intlCardAllowed: boolean;
  isBiggerMerchant: boolean;
  imagePath: string;
  tempAccount: null;
  isShopCreated: boolean;
  alipaySettlementAccount?: string;
  merchantFee: string;
  feePercentage: string;
  providerFee: string;
  databankFee: string;
  intlMerchantFee: string;
  intlFeePercentage: string;
  intlProviderFee: string;
  intlDatabankFee: string;
  dailyLimit?: string;
  oneTimeLimit?: string;
  intlDailyLimit?: string;
  intlOneTimeMaxLimit?: string;
  intlOneTimeMinLimit?: string;
  originalRequestId: string;
  id: string;
  sourceDisplay: string;
  flagDisplay: string;
}

export interface MerchantEdge {
  cursor: string;
  node: MerchantType;
}

export interface Merchants {
  merchants: {
    edgeCount: number;
    edges: MerchantEdge[];
    totalCount: number;
  };
}

