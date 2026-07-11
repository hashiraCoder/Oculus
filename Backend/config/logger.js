import {wiston} from wiston;
import config from './env';

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
    level: config.env === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json() // JSON format for production log aggregation
    ),
    defaultMeta: { service: 'scanner-api' },
    transports: [
        // Write all logs with level 'error' and below to 'error.log'
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs to 'combined.log'
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// If we are not in production, log to the console with colorized output
if (config.env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            logFormat
        )
    }));
}

export default logger;