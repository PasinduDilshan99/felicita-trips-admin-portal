// types/user-types.ts

import { ApiResponse } from "./common-types";

// User Basic Types
export interface UserBasicDetails {
  userId: number;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  email2: string | null;
  mobileNumber1: string;
  mobileNumber2: string | null;
  nic: string;
  passportNumber: string | null;
  drivingLicenseNumber: string | null;
  gender: string | null;
  nationality: string | null;
  dateOfBirth: string;
  imageUrl: string | null;
  userType: string;
  addressNumber: string | null;
  addressLane1: string | null;
  addressLane2: string | null;
  addressCity: string | null;
  addressDistrict: string | null;
  addressPostalCode: string | null;
  addressCountry: string | null;
  createdAt: string;
  updatedAt: string;
  userStatus: string; // "Active", "Inactive", "Suspended", "Banned" etc.
}

export type UserBasicDetailsApiResponse = ApiResponse<UserBasicDetails>;

// User Name and ID (without employees)
export interface UserNameAndId {
  userId: number;
  username: string;
}

export type UserNamesAndIdsApiResponse = ApiResponse<UserNameAndId[]>;

// Request types
export interface GetUserBasicDetailsRequest {
  userId: number;
}