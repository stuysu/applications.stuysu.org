import User from "../../models/user";
import getJWTData from "../auth/getJWTData";

export default async function authChecker(req, res, next) {
  req.user = null;
  req.signedIn = false;

  let jwt =
    req.cookies["jwt"] ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (jwt && jwt.startsWith("Bearer ")) {
    jwt = jwt.replace("Bearer ", "");
  }

  if (jwt) {
    const data = await getJWTData(jwt);
    let user;

    if (data) {
      user = await User.findById(data.user.id);
    }

    if (user) {
      req.user = user;
      req.signedIn = true;
    }
  }

  next();
}
