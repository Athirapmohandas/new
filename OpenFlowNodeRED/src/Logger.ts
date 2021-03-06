import * as winston from "winston";
import { Config } from "./Config";
const path = require('path');
import { createLogger, format, transports } from 'winston';
import { otel } from "./otelspec";
export class Logger {
    public static otel: otel;
    static configure(): winston.Logger {
        const filename = path.join(Config.logpath, "nodered" + Config.nodered_id + ".log");
        const options: any = {
            file: {
                level: "debug",
                filename: filename,
                handleExceptions: false,
                json: false,
                maxsize: 5242880, // 5MB
                maxFiles: 5,
                colorize: false,
            },
            console: {
                level: "debug",
                handleExceptions: false,
                json: false,
                colorize: true
            },
        };
        const myFormat = winston.format.printf(info => {
            if (info instanceof Error || info.stack) {
                return `${info.timestamp} [${info.level}] ${info.message} \n ${info.stack}`;
            }
            return `${info.timestamp} [${info.level}] ${info.message}`;
        });
        options.console.format = format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.json(),
            myFormat
        );
        const logger: winston.Logger = winston.createLogger({
            level: "debug",
            //format: winston.format.json(),
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.json(),
                myFormat
            ),
            transports: [
                new winston.transports.File(options.file),
                new winston.transports.Console(options.console)
            ]
        });
        Logger.instanse = logger;
        return logger;
    }
    static instanse: winston.Logger = null;
}