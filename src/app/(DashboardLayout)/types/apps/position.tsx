import { PermissionEdge } from "./permission";

export interface PositionType {
  name?: string;
  userType?: string;
  userTypeDisplay?: string;
  status?: string;
  statusDisplay?: string;
  permissions: string[] | { edges: PermissionEdge[] };
  uuid?: string;
  createdDate?: string;
  createdUserName?: string;
  lastUpdatedDate?: string;
  lastUpdatedUserName?: string;
}

export interface PositionEdge {
  cursor: string;
  node: PositionType;
}
