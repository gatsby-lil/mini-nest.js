export class LoggerYear {
  getYear() {
    const year = new Date().getFullYear();
    return year + "";
  }
}

export class LoggerMonth {
  getMonth() {
    const month = new Date().getMonth() + 1;
    return month + "";
  }
}

export class UseValueLoggerDate {
  getDay() {
    const day = new Date().getDay();
    console.log(day);
    return day + "";
  }
}

export class UseFactoryLoggerMessage {
  constructor(private InjectProvide, private readonly message: string) {}
  log() {
    console.log(this.InjectProvide);
    return this.message;
  }
}
