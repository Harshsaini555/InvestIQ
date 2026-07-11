type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

/* ── Level Priority ────────────────────────────────────────── */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const configuredLevel = (process.env.LOG_LEVEL ?? 'info') as LogLevel;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configuredLevel];
}

/* ── Formatter ─────────────────────────────────────────────── */
function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  if (entry.context && Object.keys(entry.context).length > 0) {
    return `${base} ${JSON.stringify(entry.context)}`;
  }
  return base;
}

/* ── Core Logger ───────────────────────────────────────────── */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  const formatted = formatEntry(entry);

  // In production, replace this with pino or a structured logging service
  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(formatted);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(formatted);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formatted);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formatted);
      break;
  }
}

/* ── Public API ────────────────────────────────────────────── */
export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
} as const;
