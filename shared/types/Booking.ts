export enum BookingSpecialPackaging {
  NONE = "none",
  FRAGILE = "fragile",
  HEAVY = "heavy",
  IRREGULAR_SHAPE = "irregular_shape",
  LIQUIDS = "liquids",
}
export enum BookingStatus {
  PENDING = "PENDING",
  TO_PICK_UP = "TO_PICK_UP",
  TO_DROP_OFF = "TO_DROP_OFF",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum BookingPaymentMethod {
  COD = "COD",
  GCASH = "GCASH",
}

export type BookingLocation = {
  name: string;
  contactNumber: string;
  address: string;
  notes: string;
  lat: number;
  lng: number;
};

export type BookingDetails = {
  width: number;
  length: number;
  height: number;
  weight: number;
  specialPackaging: BookingSpecialPackaging[];

  pickUp: BookingLocation;
  dropOut: BookingLocation;
  paymentMethod: BookingPaymentMethod;
  tip: number;
  deliveryFee: number;
  totalFee: number;
};

export type BookingDetailsExtendend = BookingDetails & {
  owner: string;
  id: string;
  status: BookingStatus;
  driver?: string;
};
