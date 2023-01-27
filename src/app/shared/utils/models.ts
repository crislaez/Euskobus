export interface ComponentState {
  search?: string | null;
  slice?: number;
  reload?: boolean;
  filter?: any;
}

export interface ApiResponse<T> {
  totalCount?: number;
  start?: number;
  rows?: number;
  result: T[];
}

export interface Geometry {
  type?: string;
  coordinates?: number[] | number[][]
}
