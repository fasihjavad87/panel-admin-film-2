import { createContext, useRef } from "react";

export const TableRefreshContext = createContext({
  registerRefresh: () => {},
  unregisterRefresh: () => {},
  refresh: () => {},
});

export const TableRefreshProvider = ({ children }) => {
  const callbacks = useRef({});

  const registerRefresh = (table, callback) => {
    callbacks.current[table] = callback;
  };

  const unregisterRefresh = (table) => {
    delete callbacks.current[table];
  };

  const refresh = (table) => {
    callbacks.current[table]?.();
  };

  return (
    <TableRefreshContext.Provider
      value={{
        registerRefresh,
        unregisterRefresh,
        refresh,
      }}
    >
      {children}
    </TableRefreshContext.Provider>
  );
};
