export class LoggerYear {
  getYear() {
    const year = new Date().getFullYear();
    console.log(year);
    return year;
  }
}

export class LoggerMonth {
  getMonth() {
    const month = new Date().getMonth();
    console.log(month);
    return month;
  }
}

export class UseValueLoggerDate {
  getDay() {
    const day = new Date().getDay();
    console.log(day);
    return day;
  }
}

export class UseFactoryLoggerMessage {
  constructor(private readonly message: string) {}
  log() {
    console.log(this.message);
    return this.message;
  }
}
