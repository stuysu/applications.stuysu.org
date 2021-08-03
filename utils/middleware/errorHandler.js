import HTTPError from "./../errors/HTTPError";

export default function (err, req, res, next) {
  if (err instanceof HTTPError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      error: "There was an unexpected error on the server: " + err.message,
    });
  }
}
