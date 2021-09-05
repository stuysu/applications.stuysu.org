import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Application from "../../models/application";
import RedirectUrl from "../../models/redirectUrl";
import User from "../../models/user";
import getJWTData from "../../utils/auth/getJWTData";

// Why does this page exist?
// Sometimes people enter short-urls for the application field
// Short urls are preferred but they don't CORS properly for iframes
// This will follow the short url and redirect the request to the final href
// This allows iframes to work properly regardless of the properties of the link url

export async function getServerSideProps(context) {
  const { url } = context.query;

  let user;
  let jwt = context.query.jwt || context.req.cookies?.jwt;

  if (jwt && jwt.startsWith("Bearer ")) {
    jwt = jwt.replace("Bearer ", "");
  }

  if (jwt) {
    if (jwt.toLowerCase().startsWith("bearer ")) {
      jwt = jwt.replace(/bearer /i, "");
    }

    const data = await getJWTData(jwt);

    if (data) {
      user = await User.findById(data.user.id);
    }
  }

  if (!user) {
    return {
      notFound: true,
    };
  }

  const application = await Application.findOne({ url });

  if (!application || !application.link) {
    return {
      notFound: true,
    };
  }

  try {
    const redirect = await RedirectUrl.getFinal(application.link);

    if (!redirect) {
      throw new Error("missing redirect");
    }

    return {
      redirect: {
        destination: redirect.final,
        permanent: false,
      },
      props: {
        link: application.link,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default function FormRedirect({ link }) {
  return (
    <Typography style={{ lineHeight: "50vh" }} align={"center"}>
      <Link href={link} target={"_blank"} referrerPolicy={"no-referrer"}>
        {link}
      </Link>
    </Typography>
  );
}
