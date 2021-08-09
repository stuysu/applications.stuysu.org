import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";
import findByEmail from "./statics/user/findByEmail";
import findByGoogleId from "./statics/user/findByGoogleId";
import queryUsers from "./statics/user/queryUsers";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleUserId: String,
  firstName: String,
  lastName: String,
  email: String,
  googleDriveAnonymityFileId: String,
  picture: String,
  adminPrivileges: Boolean,
});

UserSchema.statics.idLoader = findOneLoaderFactory("User");
UserSchema.statics.emailLoader = findOneLoaderFactory("User", "email");
UserSchema.statics.findByEmail = findByEmail;
UserSchema.statics.findByGoogleId = findByGoogleId;
UserSchema.statics.queryUsers = queryUsers;

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
