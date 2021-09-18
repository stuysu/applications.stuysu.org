const { GraphQLScalarType, Kind } = require("graphql");
const { UserInputError } = require("apollo-server-micro");

const idRegex = /^[a-f0-9]{8}$/i;

const validateID = id => {
  const isValid = typeof id === "string" && idRegex.test(id);

  if (!isValid) {
    throw new UserInputError(
      "The AnonymityID type must be a 8 character base-16 string."
    );
  }

  return id.toUpperCase();
};

const anonymityIdScalar = new GraphQLScalarType({
  name: "AnonymityID",
  description:
    "An 8 character hex string representing a user's application Anonymity ID",
  serialize: validateID,
  parseValue: validateID,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new UserInputError(
        "The AnonymityID type must be a 8 character base16 string."
      );
    }

    return validateID(ast.value);
  },
});

export default anonymityIdScalar;
