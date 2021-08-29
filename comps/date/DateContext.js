import { createContext } from "react";

export const DateContext = createContext({
  offset: 0,
  getNow: () => new Date(),
});
