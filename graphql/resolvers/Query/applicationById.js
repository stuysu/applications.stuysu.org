import Application from "../../../models/application";

export default (_, { id }) => Application.findById(id);
