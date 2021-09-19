import User from "../../../models/user";

export default a => User.idLoader.load(a.userId);
