import { NextRouter } from "next/router";
import { Label, SemanticCOLORS } from "semantic-ui-react";
import {
  BookingPaymentMethod,
  BookingSpecialPackaging,
  BookingStatus,
} from "../../shared/types/Booking";
import { BASE_URL } from "../../shared/utils";
import * as turf from "@turf/turf";

export const getEndpoint = (path: string) => {
  return BASE_URL + path;
};

export const handleRedirectButton = (router: NextRouter, path: string) => {
  return () => {
    router.replace(getEndpoint(path));
  };
};

const LabelTypeMapping = {
  [BookingStatus.PENDING]: "grey",
  [BookingStatus.TO_PICK_UP]: "violet",
  [BookingStatus.TO_DROP_OFF]: "blue",
  [BookingStatus.COMPLETED]: "orange",
  [BookingStatus.CANCELLED]: "red",

  [BookingSpecialPackaging.HEAVY]: "black",
  [BookingSpecialPackaging.FRAGILE]: "red",
  [BookingSpecialPackaging.IRREGULAR_SHAPE]: "green",
  [BookingSpecialPackaging.LIQUIDS]: "teal",

  [BookingPaymentMethod.GCASH]: "blue",
  [BookingPaymentMethod.COD]: "green",
} as Record<string, SemanticCOLORS>;

export const makeLabel = (type: string, label: string, detail?: string) => {
  return (
    <Label color={LabelTypeMapping[type] ?? "grey"} horizontal key={label}>
      {label}
      {detail ? <Label.Detail>{detail}</Label.Detail> : null}
    </Label>
  );
};

export const calculateDistance = (...positions: [number, number][]) => {
  return turf.length(turf.lineString(positions), { units: "kilometers" });
};
