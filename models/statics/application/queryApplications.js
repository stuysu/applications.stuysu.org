import escapeStringRegexp from "escape-string-regexp";
import mongoose from "./../../mongoose";

export default async ({ page, resultsPerPage, query, filters }) => {
  const offset = (page - 1) * resultsPerPage;

  const words = query.split(/\s/).filter(Boolean);

  const $and = words.map(word => {
    const regex = new RegExp(escapeStringRegexp(word), "i");
    const $or = [{ title: regex }];

    return { $or };
  });

  const filter = { ...filters };

  if ($and.length) {
    filter.$and = $and;
  }

  const Application = mongoose.model("Application");

  const results = await Application.find(filter)
    .sort([
      ["title", "asc"],
      ["color", "asc"],
      ["createdAt", "desc"],
    ])
    .skip(offset)
    .limit(resultsPerPage);

  const total = await Application.countDocuments(filter);
  const numPages = Math.ceil(total / resultsPerPage);

  const hasNextPage = page * resultsPerPage < total;
  const hasPreviousPage = offset - resultsPerPage >= 0;

  return {
    page: total ? page : 0,
    total,
    hasNextPage,
    hasPreviousPage,
    numPages,
    resultsPerPage,
    results,
  };
};
