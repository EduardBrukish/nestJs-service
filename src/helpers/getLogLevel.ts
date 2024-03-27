import { LogLevel } from '@nestjs/common';

const LEVELS = ['log', 'error', 'warn', 'debug', 'verbose'] as const;

function isLevelKey(levelKey: string): levelKey is LogLevel {
  return LEVELS.includes(levelKey as LogLevel);
}

export const getLogLevel = (logLevel): LogLevel => {
  return isLevelKey(logLevel) ? logLevel : 'warn';
};
