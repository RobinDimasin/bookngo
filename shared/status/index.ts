export enum StatusCode {
  EMAIL_TAKEN = "EMAIL_TAKEN",

  ACCOUNT_DOES_NOT_EXISTS = "ACCOUNT_DOES_NOT_EXISTS",
  ACCOUNT_EXISTS = "ACCOUNT_EXISTS",

  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  CORRECT_PASSWORD = "CORRECT_PASSWORD",

  ACCOUNT_SUCCESSFULLY_CREATED = "ACCOUNT_SUCCESSFULLY_CREATED",

  VALID_TOKEN = "VALID_TOKEN",
  INVALID_TOKEN = "INVALID_TOKEN",

  NOT_LOGGED_IN = "NOT_LOGGED_IN",
  ALREADY_LOGGED_IN = "ALREADY_LOGGED_IN",

  NONCE_TOO_LOW = "NONCE_TOO_LOW",

  NO_ACCESS = "NO_ACCESS",

  BOOKING_FOUND = "BOOKING_FOUND",
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",

  BOOKING_SUCCESSFULLY_ASSIGNED = "BOOKING_SUCCESSFULLY_ASSINED",
  BOOKING_ALREADY_ASSIGNED = "BOOKING_ALREADY_ASSIGNED",

  BOOKING_STATUS_CHANGED = "BOOKING_STATUS_CHANGED",
}

export class Status {
  private codes = new Set<StatusCode>();

  add(code: StatusCode) {
    this.codes.add(code);
  }

  delete(code: StatusCode) {
    this.codes.delete(code);
  }

  has(code: StatusCode) {
    return this.codes.has(code);
  }

  get() {
    return Array.from(this.codes.values());
  }
}
