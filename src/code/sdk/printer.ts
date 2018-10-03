// Simple class in order to test
export class Printer {
  static colorLog(message, color) {
    return console.log("%c" + message, "color:" + color);
  }

  static red(message) {
    return Printer.colorLog(message, "red");
  }

  static green(message) {
    return Printer.colorLog(message, "green");
  }

  static blue(message) {
    return Printer.colorLog(message, "blue");
  }
}
