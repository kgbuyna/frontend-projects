export interface PermissionType {
  flag?: string;
  uuid: string;
  source?: string;
  createdDate?: string;
  createdUserName?: string;
  lastUpdatedDate?: string;
  lastUpdatedUserName?: string;
  name: string;
  code: string;
  userTypes?: string[];
  id?: string;
  sourceDisplay?: string;
  flagDisplay?: string;
}

export interface PermissionEdge {
  cursor: string;
  node: PermissionType;
}
