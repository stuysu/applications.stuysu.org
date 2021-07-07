import { serialize } from "cookie";

// Taken from https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript
const setCookie = (res, name, value, options = {}) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
};

export default setCookie;
