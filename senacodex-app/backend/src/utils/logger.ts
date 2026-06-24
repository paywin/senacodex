type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    };
  }

  return { errorMessage: String(error) };
}

function writeLog(level: LogLevel, message: string, context: LogContext = {}): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const line = `${JSON.stringify(payload)}\n`;
  if (level === 'error') {
    process.stderr.write(line);
    return;
  }

  process.stdout.write(line);
}

export function logInfo(message: string, context?: LogContext): void {
  writeLog('info', message, context);
}

export function logWarn(message: string, context?: LogContext): void {
  writeLog('warn', message, context);
}

export function logError(message: string, error: unknown, context: LogContext = {}): void {
  writeLog('error', message, { ...context, ...serializeError(error) });
}
