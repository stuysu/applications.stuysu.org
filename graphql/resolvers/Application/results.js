export default (application, _, { adminRequired }) => {
  adminRequired();
  return application.results;
};
