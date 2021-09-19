export default (application, _, { user, authenticationRequired }) => {
  authenticationRequired();

  if (application.active) {
    return null;
  }

  return application.applicants.find(
    a => a.userId.toString() === user.id.toString()
  );
};
