import React, { createContext, useContext, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// export const useSidebar = () => {
//   const context = useContext(SidebarContext);

//   if (!context) {
//     throw new Error("useSidebar must be used inside SidebarProvider");
//   }

//   return context;
// };
// export const sidebarMiniContext = createContext({
//   sidebarMini: false,
//   setSidebarMini: () => {},
// });
