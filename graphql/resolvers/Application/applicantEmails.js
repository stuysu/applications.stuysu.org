export default (app, _, { adminRequired }) => {
  adminRequired();
  if (!app.active && app.type === "hybrid") {
    return app.applicantEmails;
  }
};
