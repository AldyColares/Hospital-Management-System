let handlingError = function (err, req, res, next) {
  // Array list of errors of validantion of mongoose.
  if (err.message && err.message.errors && typeof err.message !== 'string')
    err.message = err.message.errors;

  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    error: {
      status: res.status,
      message: err.message
    }
  });
};

export default handlingError;