import Application from "../../../models/application";

export default (_, { url }, { authenticationRequired }) => {
  authenticationRequired();

  return Application.findOne({
    url,
  });
};
