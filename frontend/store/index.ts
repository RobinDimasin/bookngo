import ClientStore from "./ClientStore";
import { createContext, useContext } from "react";

const store = {
  ClientStore: ClientStore,
} as const;

export const useStore = () => {
  return useContext(createContext(store));
};
