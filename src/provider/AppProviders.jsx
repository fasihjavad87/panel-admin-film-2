import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { TableRefreshProvider } from "@/context/TableRefreshContext";
import { SidebarProvider } from "@/context/sidebarContext";

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <TableRefreshProvider>{children}</TableRefreshProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
