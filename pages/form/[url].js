import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import ReactGA from "react-ga";
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

  const isEmbed = context.query.embed === "true";

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

    if (isEmbed && !redirect.embeddable) {
      return {
        props: {
          isEmbeddable: false,
          link: application.link,
        },
      };
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
    <div
      style={{
        marginTop: "40vh",
        width: "100vw",
        padding: "2rem",
        overflowWrap: "break-word",
      }}
    >
      <Typography align={"center"}>
        This URL could not be embedded successfully. Please use the following
        link to open the application. <br />
        <br />
        <Link
          href={link}
          target={"_blank"}
          referrerPolicy={"no-referrer"}
          onClick={() => {
            if (globalThis.window) {
              ReactGA.event({
                category: "Navigation",
                action: "User Opened Form Link From Unsupported Embed Page",
                label: link,
                nonInteraction: false,
              });
            }
          }}
        >
          {link}
        </Link>
      </Typography>
    </div>
  );
}
