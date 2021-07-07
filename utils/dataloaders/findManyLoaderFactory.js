import DataLoader from "dataloader";
import mongoose from "./../../models/mongoose";

export default function findManyLoaderFactory(
  model,
  field,
  conditions = {},
  projections = {},
  options = {}
) {
  const batchLoadFn = async keys => {
    const Model = mongoose.model(model);

    const keyMap = {};

    const uniqueKeys = [...new Set(keys)];

    const actualConditions =
      conditions instanceof Function ? conditions() : conditions;

    /** @type Array */
    const entries = await Model.find(
      {
        [field]: { $in: uniqueKeys },
        ...actualConditions,
      },
      { ...projections },
      { ...options }
    );

    for (let x = 0; x < entries.length; x++) {
      const entry = entries[x];
      const key = entry[field];

      if (!keyMap[key]) {
        keyMap[key] = [];
      }

      keyMap[key].push(entry);
    }

    const response = [];

    for (let x = 0; x < keys.length; x++) {
      const key = keys[x];
      response.push(keyMap[key] || []);
    }

    return response;
  };

  return new DataLoader(batchLoadFn, { cache: false });
}
