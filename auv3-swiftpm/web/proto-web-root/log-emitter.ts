type LogKind = "trace" | "info" | "log" | "warn" | "error";

export type LogItem = {
  timestamp: number;
  subsystem: string;
  logKind: LogKind;
  message: string;
};

function createLogFormatter() {
  const subsystemIcons: Record<string, string> = {
    host: "🧊",
    app: "🔸",
    ext: "🔸",
    ui: "🔹",
    dsp: "🔺",
  };

  const logKindIcons: Record<string, string> = {
    trace: "🔽",
    info: "◻️",
    log: "▫️",
    warn: "⚠️",
    error: "📛",
  };

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    //00:00:00.000
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  function formatLogLine(logItem: LogItem): string {
    const ssIcon = subsystemIcons[logItem.subsystem ?? ""] ?? "";
    const kindIcon = logKindIcons[logItem.logKind ?? ""] ?? "";
    const ts = formatTimestamp(logItem.timestamp);
    return `${ts} [${ssIcon} ${logItem.subsystem}] ${kindIcon} ${logItem.message}`;
  }
  return { formatLogLine };
}
const logFormatter = createLogFormatter();

export function writeLogItemToConsole(logItem: LogItem) {
  const logLine = logFormatter.formatLogLine(logItem);
  console.log(logLine);
}
