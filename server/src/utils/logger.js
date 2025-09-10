import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

//  Define custom log levels (optional: extend default levels like 'error', 'warn', 'info', 'debug')
const customLevels = {
    levels: {
        error: 0, // Critical errors (e.g., DB failures)
        warn: 1, // Warnings (e.g., deprecated features)
        info: 2, // General info (e.g., server started)
        http: 3, // HTTP requests (if you add middleware)
        debug: 4, // Debug details (dev only)
        audit: 5, // Custom level: e.g., user actions like 'toggleLike'
    },
    colors: {
        // For colored console output
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "magenta",
        debug: "green",
        audit: "cyan",
    },
};

const env = process.env.MODE_ENV || "development";

// Log format: Timestamp + Level + Message + Metadata (JSON for easy parsing in tools like Kibana)
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss " }),
    format.errors({ stack: true }), // Include stack traces for errors
    format.splat(), // Support string interpolation like logger.info('User %s logged in', userId)
    format.json() // Output as JSON for file logs (parsable)
);

const consoleFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss " }),
    format.errors({ stack: true }), // Include stack traces for errors
    format.splat(), // Support string interpolation like logger.info('User %s logged in', userId)
    format.json(),
    format.colorize({
        all: true, // Apply colors to all log levels
        colors: customLevels.colors, // Use our custom colors
    }),
    format.simple()
);

const logger = createLogger({
    levels: customLevels.levels,
    format: logFormat,
    level: env === "production" ? "info" : "debug",

    transports: [
        new transports.Console({
            format: consoleFormat,
            level: env === "production" ? "info" : "debug",
            silent: env === "test",
        }),

        new DailyRotateFile({
            filename: "./logs/application-%DATE%.log",
            zippedArchive: true,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: "info",
        }),
        new DailyRotateFile({
            filename: "./logs/application-%DATE%.log",
            zippedArchive: true,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: "error",
        }),
    ],
});

// import("winston").addColors(customLevels.colors);

// Optional: Stream for Morgan (if you add HTTP logging middleware later)
logger.stream = {
    write: (message) => logger.http(message.trim()),
};

export default logger;
