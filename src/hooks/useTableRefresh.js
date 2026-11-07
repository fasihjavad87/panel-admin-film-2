import { useContext } from "react";
import { TableRefreshContext } from "@/context/TableRefreshContext";

export const useTableRefresh = () => {
  const context = useContext(TableRefreshContext);

  if (!context) {
    throw new Error("useTableRefresh must be used inside TableRefreshProvider");
  }

  return context;
};
