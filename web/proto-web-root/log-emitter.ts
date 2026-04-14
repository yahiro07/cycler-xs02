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

  function formatLogLine(logItem: LogItem): string {
    const ssIcon = subsystemIcons[logItem.subsystem ?? ""] ?? "";
    const kindIcon = logKindIcons[logItem.logKind ?? ""] ?? "";
    return `[${ssIcon}${logItem.subsystem}] ${kindIcon} ${logItem.message}`;
  }
  return { formatLogLine };
}
const logFormatter = createLogFormatter();

export function writeLogItemToConsole(logItem: LogItem) {
  const logLine = logFormatter.formatLogLine(logItem);
  console.log(logLine);
}
