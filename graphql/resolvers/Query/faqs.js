import FAQ from "../../../models/faq";

export default (_, { query, page, resultsPerPage }) =>
  FAQ.queryFAQs({ query, page, resultsPerPage });
