type Printer = (msg: String) => void;

export class Logger {
  private static printer: Printer = console.log;

  private tag: String;

  private constructor(tag: String) {
    this.tag = tag;
  }

  log(log: String) {
    Logger.printer(`[${this.tag}] ${log}`);
  }

  static setPrinter(printer: Printer) {
    Logger.printer = printer;
  }

  static new(tag: String) {
    return new Logger(tag);
  }
}
