export const ok = (
  res,
  data = {},
  message = "success",
  status = 200,
  meta = {},
) => res.status(status).json({ success: true, message, data, meta });
export const fail = (res, message, status = 400, errors) =>
  res.status(status).json({
    success: false,
    message,
    data: {},
    meta: {},
    ...(errors ? { errors } : {}),
  });
export const page = (req) => ({
  page: Math.max(Number(req.query.page) || 1, 1),
  limit: Math.min(Math.max(Number(req.query.limit) || 10, 1), 50),
});
