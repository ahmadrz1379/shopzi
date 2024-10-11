// src/ApiContext.js
import React, { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children, nonce }) => {
  return (
    <ApiContext.Provider value={{ nonce }}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
