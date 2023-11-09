const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
  format: format.combine(format.simple()),
  transports: [
    new transports.File({
      //Indicamos el tamaño max del archivo
      maxsize: 5120000,
      //Indicamos la cantidad maxima de archivos
      maxFiles: 5,
      filename: "${__dirname}/../logs/log-api.log",
    }),
    new transports.Console({
      level: "debug",
    }),
  ],
});
