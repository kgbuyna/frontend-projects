export interface userType {
  id: string;
  avatar: string;
  name: string;
  role: string;
  country: string;
  isFollowed: boolean;
}

export interface GallaryType {
  id: string;
  cover: string;
  name: string;
  time: string;
}

export interface Oauth {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}
export interface UserType {
  password?: string;
  confirmPassword?: string;
  lastLogin?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  isStaff?: boolean;
  isActive?: boolean;
  dateJoined?: string;
  source?: string;
  objectId?: string;
  userType?: string;
  userTypeDisplay?: string;
  phone?: string;
  status?: string;
  statusDisplay?: string;
  isSystem?: boolean;
  ldapUsername?: string;
  createdDate?: string;
  createdUserName?: string;
  lastUpdatedDate?: string;
  lastUpdatedUserName?: string;
  ldapExpireDay?: number;
  ldapForceUse?: boolean;
  sourceDisplay?: string;
  flagDisplay?: string;
  pk?: string;
  namespacePositions?: { namespace: string; position: string[] }[];
}

export interface UserEdge {
  cursor: string;
  node: UserType;
}
