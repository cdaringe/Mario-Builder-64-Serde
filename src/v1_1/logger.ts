type LogLevel = "debug" | "log" | "warn" | "error";

let logLevel: LogLevel = "error";
const logLevelByName: Record<LogLevel, number> = {
  debug: 0,
  log: 1,
  warn: 2,
  error: 3,
};

export const log = (level: LogLevel, ...args: any[]) => {
  if (logLevelByName[level] >= logLevelByName[logLevel]) {
    console[level](...args);
  }
};
