const isDebug = location.search.includes("debug=1");

type LogKind = "trace" | "info" | "log" | "warn" | "error";

type LogItem = {
  timestamp: number;
  subsystem: string;
  logKind: LogKind;
  message: string;
};

type LogArguments = (
  | string
  | number
  | boolean
  | object
  | Array<string | number | boolean | object>
  | unknown
)[];

type ILogger = {
  forwardLogItem(logItem: LogItem): void;
  trace(...args: LogArguments): void;
  info(...args: LogArguments): void;
  log(...args: LogArguments): void;
  warn(...args: LogArguments): void;
  error(...args: LogArguments): void;
};

type ILogMessageFromUi = {
  type: "log";
} & LogItem;

type IWindowTyped = {
  webkit?: {
    messageHandlers: {
      pluginEditor?: {
        postMessage: (msg: ILogMessageFromUi) => void;
      };
    };
  };
};

function sendLogItemToWebViewOwner(logItem: LogItem) {
  const windowTyped = window as unknown as IWindowTyped;
  windowTyped.webkit?.messageHandlers.pluginEditor?.postMessage({
    type: "log",
    timestamp: logItem.timestamp,
    subsystem: logItem.subsystem,
    logKind: logItem.logKind,
    message: logItem.message,
  });
}

function mapLogArgumentsToString(args: LogArguments) {
  return args
    .map((arg) => {
      if (typeof arg === "object") {
        return JSON.stringify(arg);
      }
      return String(arg);
    })
    .join(" ");
}

export function createLogger(subsystem: string): ILogger {
  if (!isDebug) {
    return {
      forwardLogItem() {},
      trace() {},
      info() {},
      log() {},
      warn() {},
      error() {},
    };
  }
  function pushLog(kind: LogKind, args: LogArguments) {
    const msg = mapLogArgumentsToString(args);
    const logItem: LogItem = {
      timestamp: Date.now(),
      subsystem,
      logKind: kind,
      message: msg,
    };
    sendLogItemToWebViewOwner(logItem);
  }
  return {
    forwardLogItem(logItem: LogItem) {
      sendLogItemToWebViewOwner(logItem);
    },
    trace(...args: LogArguments) {
      pushLog("trace", args);
    },
    info(...args: LogArguments) {
      pushLog("info", args);
    },
    log(...args: LogArguments) {
      pushLog("log", args);
    },
    warn(...args: LogArguments) {
      pushLog("warn", args);
    },
    error(...args: LogArguments) {
      pushLog("error", args);
    },
  };
}

export const logger = createLogger("ui");
