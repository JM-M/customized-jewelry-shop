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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface TerminalParcelItem {
  description: string;
  name: string;
  currency: string;
  value: number;
  weight: number;
  quantity: number;
}

export interface TerminalParcel {
  id: string;
  description?: string;
  items: TerminalParcelItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  proof_of_payments: string[];
  rec_docs: string[];
  packaging: string;
  parcel_id: string;
  totalWeight: number;
  weight: number;
  weight_unit: string;
  created_at: string;
  updated_at: string;
}

export interface TerminalCreateParcelResponse {
  status: boolean;
  message: string;
  data: TerminalParcel;
}

export interface TerminalRate {
  amount: number;
  carrier_id: string;
  carrier_logo: string;
  carrier_name: string;
  carrier_rate_description: string;
  currency: string;
  delivery_time: string;
  id: string;
  includes_insurance: boolean;
  insurance_coverage: number;
  insurance_fee: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  pickup_time: string;
  rate_id: string;
  shipment: string;
  created_at: string;
  updated_at: string;
}

export interface TerminalGetRatesForShipmentResponse {
  status: boolean;
  message: string;
  data: TerminalRate[];
  pageData: {
    total: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}

export interface TerminalGetDefaultSenderResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    user: string;
    address_id: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
      place_id: string;
      google_postal_code: string;
    };
    country: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    line1?: string;
    line2?: string;
    phone?: string;
    place_id: string;
    state: string;
    zip?: string;
    is_residential: boolean;
    sender_default: boolean;
    metadata: {
      google_postal_code: string;
    };
    created_at: string;
    updated_at: string;
    __v: number;
    id: string;
  };
}

export type GetDeliveryRatesOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getDeliveryRates"];

export type GetCheckoutSessionOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getCheckoutSession"];

export type UpdateCheckoutStepOutput =
  inferRouterOutputs<AppRouter>["terminal"]["updateCheckoutStep"];

export type CreateCheckoutSessionOutput =
  inferRouterOutputs<AppRouter>["terminal"]["createCheckoutSession"];

export type CompleteCheckoutSessionOutput =
  inferRouterOutputs<AppRouter>["terminal"]["completeCheckoutSession"];

export type GetDefaultSenderAddressOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getDefaultSenderAddress"];

export type GetRatesForShipmentOutput =
  inferRouterOutputs<AppRouter>["terminal"]["getDeliveryRates"];
