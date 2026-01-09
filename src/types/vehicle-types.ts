export interface VehicleIdName {
  vehicleId: number;
  registerNumber: string;
}

export interface VehicleIdNameResponse {
  code: number;
  status: string;
  message: string;
  data: VehicleIdName[];
  timestamp: string;
}