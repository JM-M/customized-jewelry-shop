import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetUserAddressesOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getUserAddresses"];

export type GetPickupAddressesOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getPickupAddresses"];

export interface TerminalAddress {
  address_id: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  email?: string;
  first_name?: string;
  id: string;
  is_residential: boolean;
  last_name?: string;
  line1?: string;
  line2?: string;
  metadata?: Record<string, any>;
  name?: string;
  phone?: string;
  state: string;
  zip?: string;
  created_at: string;
  updated_at: string;
}

export interface TerminalCreateAddressResponse {
  status: boolean;
  message: string;
  data: TerminalAddress;
}

export interface TerminalGetAddressesResponse {
  status: boolean;
  message: string;
  data: {
    addresses: TerminalAddress[];
    pagination: {
      perPage: number;
      prevPage: number | null;
      nextPage: number | null;
      currentPage: number;
      total: number;
      pageCount: number;
      pagingCounter: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export interface TerminalGetAddressResponse {
  status: boolean;
  message: string;
  data: TerminalAddress;
}

export interface TerminalCountry {
  isoCode: string;
  name: string;
  phonecode: string;
  flag: string;
  currency: string;
  latitude: string;
  longitude: string;
  timezones: {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }[];
}

export interface TerminalGetCountriesResponse {
  status: boolean;
  message: string;
  data: TerminalCountry[];
}

export interface TerminalPackaging {
  height: number;
  id: string;
  length: number;
  name: string;
  packaging_id: string;
  size_unit: string;
  type: string;
  weight: number;
  weight_unit: string;
  width: number;
  created_at: string;
  updated_at: string;
}

export interface TerminalGetPackagingsResponse {
  status: boolean;
  message: string;
  data: {
    packaging: TerminalPackaging[];
    pagination: {
      perPage: number;
      prevPage: number | null;
      nextPage: number | null;
      currentPage: number;
      total: number;
      pageCount: number;
      pagingCounter: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export type PickupAddress = GetPickupAddressesOutput["items"][number];

export interface CreatePickupAddressInput {
  terminalAddressId: string;
  isDefault?: boolean;
  nickname?: string;
}

export interface UpdatePickupAddressInput {
  id: string;
  terminalAddressId?: string;
  isDefault?: boolean;
  nickname?: string;
}
