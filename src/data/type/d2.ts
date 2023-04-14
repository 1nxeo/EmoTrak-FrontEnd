export interface PropsData {
  month: number | string;
  graphData: graphDataType[];
}

export interface graphDataType {
  month: number;
  graph: Graph[];
}

export interface Graph {
  id: number;
  count: number;
  percentage: number;
}

export interface IAdminData {
  id: number;
  nickname: string;
  email: string;
  count: number;
  reason: string;
}

export interface IPayload {
  auth: string;
}