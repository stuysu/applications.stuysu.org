import { ApolloServer, ForbiddenError } from "apollo-server-micro";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/typeDefs";
import User from "../../models/user";
import getJWTData from "../../utils/auth/getJWTData";
import unboundSetCookie from "../../utils/middleware/setCookie";

const ComplexityLimitRule = createComplexityLimitRule(75000, {
  scalarCost: 1,
  objectCost: 5,
  listFactor: 10,
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let user, signedIn, anonymitySecret;

    let jwt =
      req.cookies["jwt"] ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (jwt && jwt.startsWith("Bearer ")) {
      jwt = jwt.replace("Bearer ", "");
    }

    if (jwt) {
      const data = await getJWTData(jwt);

      if (data) {
        user = await User.findById(data.user.id);
      }

      if (user) {
        signedIn = true;
        anonymitySecret = data.user.anonymitySecret;
      }
    }

    function authenticationRequired() {
      if (!signedIn) {
        throw new ForbiddenError("You must be signed in to perform that query");
      }
    }

    function isAdmin() {
      return signedIn && user.adminPrivileges;
    }

    function adminRequired(role) {
      authenticationRequired();
      if (!isAdmin(role)) {
        throw new ForbiddenError(
          "You don't have the necessary permissions to perform that query"
        );
      }
    }

    const setCookie = unboundSetCookie.bind(unboundSetCookie, res);

    return {
      user,
      signedIn,
      adminRequired,
      authenticationRequired,
      anonymitySecret,
      setCookie,
    };
  },
  uploads: {
    maxFileSize: 10000000,
  },
  introspection: true,
  playground: {
    settings: {
      "schema.polling.enable": false,
      "request.credentials": "same-origin",
      "prettier.useTabs": true,
    },
  },
  validationRules: [ComplexityLimitRule],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
