import {createLogger, format, transports, Logger, LoggerOptions} from 'winston';

const logLevel = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'info';
  }

  return 'debug';
};

const loggerOptions: LoggerOptions = {
  format: format.combine(
    // Use these two instead for JSON format
    // format.timestamp(),
    // format.json()
    format.timestamp({format: 'DD-MM-YYYY HH:mm:ss.SSS'}),
    format.printf((info): string => {
      return `[${info.timestamp}] [${info.level.toUpperCase()}] ${
        info.message
      }`;
    })
  ),
  transports: [new transports.Console({level: logLevel()})],
};

const logger: Logger = createLogger(loggerOptions);

export default logger;
