import clc from "cli-color";

export class Logger {
  private static lastLogTime = Date.now();
  static log(message: string, context: string = "") {
    const timestamp = new Date().toLocaleDateString();
    // 获取进程ID
    const pid = process.pid;
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastLogTime;
    console.log(
      `[${clc.green("Nest")}] ${clc.green(pid.toString())}  - ${clc.yellow(
        timestamp
      )}     ${clc.green("LOG")} [${clc.yellow(context)}] ${clc.green(
        message
      )} ${clc.white("+")}${clc.green(timeDiff)}${clc.white("ms")}`
    );
    this.lastLogTime = currentTime;
  }
}
