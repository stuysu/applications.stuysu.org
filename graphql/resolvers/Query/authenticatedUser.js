export default (_, __, { signedIn, user }) => (signedIn ? user : null);
