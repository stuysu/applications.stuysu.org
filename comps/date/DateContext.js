import { createContext } from "react";

const DateContext = createContext({
  offset: 0,
  getNow: () => new Date(),
});

export default DateContext;
