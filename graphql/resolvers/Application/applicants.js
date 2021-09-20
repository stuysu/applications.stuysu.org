export default (application, _, { adminRequired }) => {
  adminRequired();

  if (!application.active) {
    return application.applicants;
  }
};
