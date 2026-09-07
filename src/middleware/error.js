export default function errorHandler(error, req, res, next) {
  console.error(error);
  const status =
    error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
  res
    .status(status)
    .json({
      success: false,
      message: status === 500 ? "Internal server error" : error.message,
    });
}
