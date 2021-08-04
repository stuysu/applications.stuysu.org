import FAQ from "../../../models/faq";

export default (_, { id }) => FAQ.findById(id);
