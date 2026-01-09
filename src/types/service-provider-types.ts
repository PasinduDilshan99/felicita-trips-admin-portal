export interface ServiceProviderIdName {
  serviceProviderId: number;
  serviceProviderName: string;
}

export interface ServiceProviderIdNameResponse {
  code: number;
  status: string;
  message: string;
  data: ServiceProviderIdName[];
  timestamp: string;
}