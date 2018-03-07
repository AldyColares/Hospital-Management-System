let ErrorController = {};

ErrorController.handlingError = function (err, req, res, next) {

  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
};

module.exports = ErrorController;