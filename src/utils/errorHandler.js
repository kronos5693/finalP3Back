const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Algo salió mal!' });
};

module.exports = errorHandler;
