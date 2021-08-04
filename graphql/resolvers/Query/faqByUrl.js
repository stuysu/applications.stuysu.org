import FAQ from "../../../models/faq";

export default (_, { url }) => FAQ.findOne({ url });
