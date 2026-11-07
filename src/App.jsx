import React, { useState } from "react";
import Icon from "./components/IconSprite";
// import Icon from '@/components/AllIcons2';
import ToastContainer from "./components/Toast/ToastContainer";
import ModalContainerConfirm from "@/components/Modal/ModalContainerConfirm";
import jMoment from "moment-jalaali";
import { BrowserRouter, useLocation } from "react-router-dom";
import AuthLayout from "@/layouts/authLayout/Index";
import AdminLayout from "@/layouts/adminLayout/Index";
import AppInitializer from "@/provider/AppInitializer";
import AppRoutes from "@/routes";
import AppProviders from "@/provider/AppProviders";
import GlobalTooltip from "@/components/GlobalTooltip";
import AuthWatcher from "@/provider/AuthWatcher";

const App = () => {
  const location = useLocation();

  jMoment.loadPersian({
    dialect: "persian-modern",
    usePersianDigits: false, // اگه عدد فارسی نمی‌خوای
  });

  return (
    <div>
      <AppProviders>
        <AppInitializer />
        <AppRoutes />
        <AuthWatcher/>
        <Icon />
        {/* <Icon /> */}
        {/* <div> */}
        {/* {
              location.pathname.includes('/auth') ? (
                <AuthLayout />
              ) : (
                <AdminLayout />
              )
            } */}
        {/* <sidebarContext.Provider value={{
            sidebarOpen,
            setSidebarOpen,
            // sidebarMini,
            // setSidebarMini
          }}>
            <Header />
            <Content />
            <Sidebar />
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40  bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
          </sidebarContext.Provider> */}
        {/* <ConfirmModal /> */}
        {/* </div> */}
        <ToastContainer />
        <ModalContainerConfirm />
         <GlobalTooltip
                defaultPlacement="top"
                defaultOffset={8}
                className="bg-black/80 px-2.5  rounded-md text-[13px] leading-6 whitespace-nowrap"
            />
      </AppProviders>
    </div>
  );
};

export default App;
