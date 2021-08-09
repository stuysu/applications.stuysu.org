export default async (_, { fileId }, { authenticationRequired, user }) => {
  authenticationRequired();

  user.googleDriveAnonymityFileId = fileId;
  await user.save();
};
