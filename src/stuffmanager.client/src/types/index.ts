// Types for the Stuff entity
export interface Stuff {
  id: number;
  name: string;
  description: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiError {
  code: string;
  message: string;
}
