import {
  BookingDetails,
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import { Database } from "../database";
import dotenv from "dotenv";
import { Status, StatusCode } from "../../shared/status";
import { v4 as uuidv4 } from "uuid";
import { DriverAccount, PersonalAccount } from "../account";
import { BookingModel } from "../database/models/BookingModel";
dotenv.config();

class Queue<T extends any> {
  items: Record<number, T> = {};
  head = 0;
  tail = 0;

  enqueue(item: T) {
    this.items[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.items[this.head];
  }

  get length() {
    return this.tail - this.head;
  }
}

export class BookingQueue extends Queue<() => void | Promise<void>> {
  private isRunning = false;

  enqueue(item: () => void | Promise<void>) {
    super.enqueue(item);

    this.run();
  }

  async run() {
    if (!this.isRunning) {
      this.isRunning = true;

      while (this.length > 0) {
        const item = this.dequeue();
        await item();
      }

      this.isRunning = false;
    }
  }
}

export class Booking {
  private static queues = new Map<string, BookingQueue>();

  static new(details: BookingDetailsExtendend, token: string) {
    return new Promise<{ id: string | null; status: Status }>(
      async (resolve) => {
        const BookingModel = Database.getModel("booking");

        const status = new Status();
        const id = uuidv4();

        const { payload, status: validationStatus } =
          PersonalAccount.validateToken(token);
        validationStatus.get().forEach((s) => status.add(s));

        if (payload.key) {
          if (!Booking.queues.has(payload.key)) {
            Booking.queues.set(payload.key, new BookingQueue());
          }

          const { account, status: accountStatus } =
            await PersonalAccount.getDetails(payload.key!);
          accountStatus.get().forEach((s) => status.add(s));

          if (account === null) {
            status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
            resolve({
              id: null,
              status,
            });
          } else {
            const initialNonce = account.nonce;

            Booking.queues.get(account.key!)!.enqueue(async () => {
              const accountDetails = await PersonalAccount.getDetails(
                payload.key!
              );
              const nonce = accountDetails!.account?.nonce;

              if (initialNonce !== nonce) {
                status.add(StatusCode.NONCE_TOO_LOW);
                resolve({
                  id: null,
                  status,
                });
              }

              const bookingDetails = await new BookingModel({
                ...details,
                owner: account.key,
                id,
                totalFee: details.deliveryFee + (details.tip ?? 0),
              }).save();

              await PersonalAccount.Model.updateOne(
                { key: account.key },
                { $inc: { nonce: 1 } }
              );

              resolve({
                id: bookingDetails.id,
                status,
              });
            });
          }
        } else {
          status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
          resolve({
            id: null,
            status,
          });
        }
      }
    );
  }

  static async assign(key: string, id: string) {
    const status = new Status();
    const { booking, status: s } = await Booking.get(id);

    if (s.has(StatusCode.BOOKING_FOUND)) {
      if (!booking.driver) {
        const BookingModel = Database.getModel("booking");
        await BookingModel.updateOne(
          { id },
          { driver: key, status: BookingStatus.TO_PICK_UP }
        );

        status.add(StatusCode.BOOKING_SUCCESSFULLY_ASSIGNED);
      } else {
        status.add(StatusCode.BOOKING_ALREADY_ASSIGNED);
      }
    } else {
      status.add(StatusCode.BOOKING_NOT_FOUND);
    }

    return {
      status,
    };
  }

  static async changeStatus(id: string, newStatus: BookingStatus) {
    const status = new Status();
    const { status: s } = await Booking.get(id);

    if (s.has(StatusCode.BOOKING_FOUND)) {
      const BookingModel = Database.getModel("booking");
      await BookingModel.updateOne({ id }, { status: newStatus });

      status.add(StatusCode.BOOKING_STATUS_CHANGED);
    } else {
      status.add(StatusCode.BOOKING_NOT_FOUND);
    }

    return {
      status,
    };
  }

  static async fromOwner(key: string, bookingStatus: BookingStatus[] = []) {
    const status = new Status();
    let bookingsFound: BookingDetailsExtendend[] = [];

    if (await PersonalAccount.isRegistered(key)) {
      const BookingModel = Database.getModel("booking");
      const bookings = await BookingModel.find({ owner: key });
      bookingsFound = bookings
        .filter((booking) =>
          bookingStatus.length === 0
            ? true
            : bookingStatus.includes(booking.status)
        )
        .map((booking) => booking.toJSON());
    } else {
      status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
    }

    return {
      bookings: bookingsFound,
      status,
    };
  }

  static async fromDriver(key: string, bookingStatus: BookingStatus[] = []) {
    const status = new Status();
    let bookingsFound: BookingDetailsExtendend[] = [];

    if (await DriverAccount.isRegistered(key)) {
      const BookingModel = Database.getModel("booking");
      const bookings = await BookingModel.find({ driver: key });
      bookingsFound = bookings
        .filter((booking) =>
          bookingStatus.length === 0
            ? true
            : bookingStatus.includes(booking.status)
        )
        .map((booking) => booking.toJSON());
    } else {
      status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
    }

    return {
      bookings: bookingsFound,
      status,
    };
  }

  static async find(...bookingStatus: BookingStatus[]) {
    const status = new Status();

    const BookingModel = Database.getModel("booking");
    const bookings = await BookingModel.find();

    const bookingsFound: BookingDetailsExtendend[] = bookings
      .filter((booking) =>
        bookingStatus.length === 0
          ? true
          : bookingStatus.includes(booking.status)
      )
      .map((booking) => booking.toJSON());

    return {
      bookings: bookingsFound,
      status,
    };
  }

  static async get(id: string) {
    const status = new Status();

    const booking = (await Database.getModel("booking").findOne({
      id,
    })) as BookingDetailsExtendend;

    if (booking) {
      status.add(StatusCode.BOOKING_FOUND);
    } else {
      status.add(StatusCode.BOOKING_NOT_FOUND);
    }

    return {
      booking,
      status,
    };
  }
}
