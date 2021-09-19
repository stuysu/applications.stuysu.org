export default (application, _, { user, authenticationRequired }) => {
  authenticationRequired();

  return application.results.applicants.find(
    a => a.userId.toString() === user.id.toString()
  );
};
