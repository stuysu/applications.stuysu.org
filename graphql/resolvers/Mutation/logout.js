export default (_, __, { setCookie }) => {
  setCookie("jwt", "", {
    expires: new Date(1),
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};
