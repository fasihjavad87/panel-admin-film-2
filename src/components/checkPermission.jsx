import React, { useMemo } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";

const CheckPermission = ({ permission, children }) => {
  const check = useHasPermission(permission);
  return useMemo(() => (check ? children : null), [check, children]);
};

export default CheckPermission;
