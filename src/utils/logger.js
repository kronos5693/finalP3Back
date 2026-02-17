const { createLogger, format, transports } = require("winston");

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    }))

module.exports = createLogger({
    format: logFormat,

    transports: [
        new transports.File({
            //Indicamos el tamaño max del archivo
            maxsize: 5120000,
            //Indicamos la cantidad maxima de archivos
            maxFiles: 5,
            filename: `${__dirname}/../logs/log-api.log`,
        }),
        new transports.Console({
            level: "debug",
        }),
    ],
});