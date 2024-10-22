export class LoggerYear {
  logYear() {
    console.log(new Date().getFullYear());
  }
}

export class LoggerMonth {
  logMonth() {
    console.log(new Date().getMonth());
  }
}

export class UseValueLoggerDate {
  logDay() {
    console.log(new Date().getDay());
  }
}

export class UseFactoryLoggerMessage {
  log(message?: string) {
    console.log(message);
  }
}
