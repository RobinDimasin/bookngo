import { makeAutoObservable } from "mobx";
import jwt from "jsonwebtoken";
import { AccountTypes } from "../../shared/types/AccountTypes";
import axios from "axios";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import { getEndpoint } from "../util";

class ClientStore {
  token: string | null = null;
  key: string | null = null;
  accountType: AccountTypes | null = null;

  bookingsCount: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async setToken(token: string | null) {
    this.token = token;

    if (this.token) {
      const payload = jwt.decode(this.token);

      if (
        payload &&
        typeof payload !== "string" &&
        payload.key &&
        payload.accountType
      ) {
        this.setAccountType(payload.accountType);
        this.setKey(payload.key);

        this.fetchBookingCount();
      }
    } else {
      this.setKey(null);
    }
  }

  setAccountType(accountType: AccountTypes | null) {
    this.accountType = accountType;
  }

  setKey(key: string | null) {
    this.key = key;
  }

  async fetchBookingCount() {
    const {
      data: { bookings },
    } = await axios.get<{ bookings: BookingDetailsExtendend[] }>(
      getEndpoint(
        `/api/bookings?${[
          BookingStatus.PENDING,
          BookingStatus.TO_PICK_UP,
          BookingStatus.TO_DROP_OFF,
        ]
          .map((status) => `status=${status}`)
          .join("&")}`
      )
    );

    this.bookingsCount = bookings.length;
  }
}

const store = new ClientStore();
export default store;
