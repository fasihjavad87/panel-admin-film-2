import React, { useContext, useState, useEffect, useRef } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { useLocation } from "react-router-dom";
import ToggleSubMenuItem from "@/components/ToggleSubMenuItem";
import ToggleMenuItem from "@/components/ToggleMenuItem";
import MenuItem from "@/components/MenuItem";
import Tooltip from "@/components/Tooltip";
import { toast } from "@/components/Toast/ToastContainer";

import { openConfirmModal, openAlertModal } from "@/components/Modal/modal";
import { logout } from "@/redux/user/userActions";
import { useDispatch } from "react-redux";

const Index = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const sidebarRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const scrollTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const handleToggleMenu = () => {
    setSidebarOpen(false);
  };

  // const toggleSubMenu = (menuId, forceState = null) => {
  //     setOpenMenus(prev => {
  //         if (forceState !== null) {
  //             return {
  //                 ...prev,
  //                 [menuId]: forceState
  //             };
  //         }
  //         // toggle کردن
  //         const currentState = prev[menuId] || false;
  //         return {
  //             ...prev,
  //             [menuId]: !currentState
  //         };
  //     });
  // };

  const toggleSubMenu = (menuId, forceState = null, currentIsOpen = false) => {
    setOpenMenus((prev) => {
      if (forceState !== null) {
        return {
          ...prev,
          [menuId]: forceState,
        };
      }

      const currentState =
        prev[menuId] !== undefined ? prev[menuId] : currentIsOpen;

      return {
        ...prev,
        [menuId]: !currentState,
      };
    });
  };

  // تابع پیدا کردن آیتم فعال در سایدبار
  const findAndScrollToActive = (behavior = "smooth") => {
    if (!sidebarRef.current) return;

    const activeLink = sidebarRef.current.querySelector(".bg-orange-50");

    if (activeLink) {
      const parentLi = activeLink.closest("li");
      if (parentLi) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          parentLi.scrollIntoView({
            behavior: behavior,
            block: "center",
            inline: "nearest",
          });
        }, 300);
      }
    }
  };

  // وقتی مسیر عوض میشه - منوها رو ریست کن
  useEffect(() => {
    // همه منوها رو ببند
    setOpenMenus({});

    const timer = setTimeout(() => {
      findAndScrollToActive("smooth");
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  // لود اولیه
  useEffect(() => {
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        findAndScrollToActive("auto");
        setIsFirstLoad(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  // وقتی سایدبار باز میشه
  useEffect(() => {
    if (sidebarOpen) {
      const timer = setTimeout(() => {
        findAndScrollToActive("smooth");
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  const handleLogout = async () => {
    const confirmed = await openConfirmModal({
      title: "خروج از حساب کاربری",
      message: `آیا از خروج از حساب کاربری مطمئن هستید؟`,
      confirmText: "بله",
      cancelText: "انصراف",
      variant: "warning",
      icon: "power",
    });

    if (confirmed) {
      try {
        // ✅ صدا زدن سرویس حذف دائمی
        await dispatch(logout());

        // ✅ نمایش پیام موفقیت
        // await openAlertModal({
        //     title: "عملیات موفق",
        //     message: `کاربر "${user.name}" با موفقیت حذف شد`,
        //     confirmText: "متوجه شدم",
        //     variant: "success",
        //     icon: "check-circle",
        // });
        await toast.success(`شما با موفقیت خارج شدید`, {
          title: "موفق",
          duration: 5000,
        });
      } catch (error) {
        // ✅ مدیریت خطا
        console.error("Error force deleting user:", error);
        // await openAlertModal({
        //     title: "خطا",
        //     message: error.response?.data?.message || "خطا در حذف کاربر",
        //     confirmText: "متوجه شدم",
        //     variant: "danger",
        //     icon: "alert-triangle",
        // });
        await toast.error(
          error.response?.data?.message || "مشکلی در خارج کردن شما به وجود آمد",
          {
            title: "خطا",
            duration: 5000,
          },
        );
      }
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-white border border-gray-300 p-3 fixed min-h-0 overflow-hidden custom-scrollbar m-1.5 transition-all rounded-md top-0 bottom-0 w-app-sidebar-w transform z-50 flex flex-col ${sidebarOpen ? "right-0 md:w-app-sidebar-w" : "-right-[calc(var(--spacing-app-sidebar-w)+6px)] md:w-app-sidebar-w-mobile"} md:right-0`}
      id="admin-sidebar"
    >
      <div className="flex-shrink-0">
        <button className="hidden" onClick={handleToggleMenu}>
          click me!
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-[70px]">
          <ul className="flex flex-col gap-1.5">
            <MenuItem
              id="test"
              icon="#icon-home-angle"
              href="/"
              label="خانه"
              sidebarOpen={sidebarOpen}
              permission="view-user"
            />
            {/* <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    /> */}
            {/* <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    />
                    <MenuItem
                        id="test"
                        icon="#icon-forbidden-circle"
                        label="پیام"
                        href="/message"
                        sidebarOpen={sidebarOpen}
                        classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                    /> */}

            <ToggleMenuItem
              id="users"
              icon="#icon-user"
              label="کاربران"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="users-list"
                icon="#icon-users-group-two-rounded"
                label="لیست کاربران"
                href="/users"
                permission="view-user"
              />
              <ToggleSubMenuItem
                id="users-add"
                icon="#icon-user-plus"
                label="افزودن کاربر"
                href="/users/add-user"
                permission="create-user"
              />
              <ToggleSubMenuItem
                id="users-trashed"
                icon="#icon-trash-bin-minimalistic"
                label="کاربران حذف شده"
                href="/users/trashed"
                permission="view-delete-user"
              />
              <ToggleSubMenuItem
                id="roles-list"
                icon="#icon-shield-user"
                label="لیست نقش ها"
                href="/users/roles"
                permission="view-role"
              />
              <ToggleSubMenuItem
                id="permissions-list"
                icon="#icon-shield-keyhole-minimalistic"
                label="لیست مجوز ها"
                href="/users/permissions"
                permission="view-permission"
              />
            </ToggleMenuItem>

            <ToggleMenuItem
              id="media"
              icon="#icon-album"
              label="رسانه ها"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="media-list"
                icon="#icon-gallery"
                label="لیست کاربران"
                href="/media"
                permission="view-media"
              />
              <ToggleSubMenuItem
                id="media-add"
                icon="#icon-gallery-add"
                label="افزودن رسانه"
                href="/media/upload"
                permission="create-media"
              />
              <ToggleSubMenuItem
                id="media-trashed"
                icon="#icon-trash-bin-minimalistic"
                label="رسانه های حذف شده"
                href="/media/trashed"
                permission="view-delete-media"
              />
              {/* <ToggleSubMenuItem
                id="roles-list"
                icon="#icon-shield-user"
                label="لیست نقش ها"
                href="/users/roles"
                permission="view-role"
              />
              <ToggleSubMenuItem
                id="permissions-list"
                icon="#icon-shield-keyhole-minimalistic"
                label="لیست مجوز ها"
                href="/users/permissions"
                permission="view-permission"
              /> */}
            </ToggleMenuItem>

            <ToggleMenuItem
              id="movies"
              icon="#icon-clapperboard-play"
              label="فیلم و سریال"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              {/* لیست اصلی (همه محتوا) */}
              <ToggleSubMenuItem
                id="movies-list"
                icon="#icon-video-frame-play-horizontal"
                label="همه محتوا"
                href="/movies"
                permission="view-movie"
              />

              {/* فیلم‌ها */}
              <ToggleSubMenuItem
                id="movies-list-movies"
                icon="#icon-clapperboard-play"
                label="فیلم‌ها"
                href="/movies?content_type=movie"
                permission="view-movie"
              />

              {/* سریال‌ها */}
              <ToggleSubMenuItem
                id="movies-list-series"
                icon="#icon-tv"
                label="سریال‌ها"
                href="/movies?content_type=series"
                permission="view-movie"
              />

              {/* افزودن */}
              <ToggleSubMenuItem
                id="movies-add"
                icon="#icon-plus"
                label="افزودن محتوا"
                href="/movies/add-movie"
                permission="create-movie"
              />
            </ToggleMenuItem>

            <ToggleMenuItem
              id="categories"
              icon="#icon-library"
              label="دسته بندی ها"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="categories-list"
                icon="#icon-clipboard-list"
                label="لیست دسته بندی ها"
                href="/categories"
              />
              <ToggleSubMenuItem
                id="categories-add"
                icon="#icon-plus"
                label="افزودن دسته بندی"
                href="/categories/add-category"
              />
            </ToggleMenuItem>

            <ToggleMenuItem
              id="countries"
              icon="#icon-global"
              label="کشور ها"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="countries-list"
                icon="#icon-clipboard-list"
                label="لیست کشور ها"
                href="/countries"
              />
              <ToggleSubMenuItem
                id="countries-add"
                icon="#icon-plus"
                label="افزودن کشور"
                href="/countries/add-country"
              />
            </ToggleMenuItem>

            <ToggleMenuItem
              id="settings"
              icon="#icon-settings-2"
              label="تنظیمات"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="settings-general"
                icon="#icon-global"
                label="تنظیمات عمومی"
                href="/"
              />
            </ToggleMenuItem>

            <ToggleMenuItem
              id="roles"
              icon="#icon-settings-2"
              label="نقش ها"
              sidebarOpen={sidebarOpen}
              openMenus={openMenus}
              onToggle={toggleSubMenu}
            >
              <ToggleSubMenuItem
                id="role-list"
                icon="#icon-users-group-two-rounded"
                label="نقش‌های کاربری"
                href="/roles"
              />
              <ToggleSubMenuItem
                id="role-add"
                icon="#icon-users-group-two-rounded"
                label="افزودن نقش"
                href="/roles/add-role"
              />
            </ToggleMenuItem>
          </ul>
        </div>
        <div className="flex-shrink-0 pt-2">
          {/* <div className="relative group">
            <div>
              <svg className="w-22px h-22px fill-transparent">
                <use xlinkHref="#icon-plus"></use>
              </svg>
            </div>
            <div className="absolute hidden group-hover:block left-0 top-0 bg-blue-500 rounded-md">
                Im Test
            </div>
          </div> */}
          {/* <Tooltip
            placement="left"
            offset={30}
            trigger="hover"
            content={
              <div className="bg-white shadow-xl border rounded-lg p-3 min-w-[180px]">
                <h4 className="font-bold mb-2 text-red-500">تنظیمات</h4>
                <p className="text-sm text-gray-600">
                  اینجا می‌تونی هرچی بخوای بذاری
                </p>
              </div>
            }
          > */}
          {/* <button className="p-1.5 bg-blue-50 rounded-md border">
              <svg className="w-5 h-5">
                <use xlinkHref="#icon-plus" />
              </svg>
            </button> */}
          {/* <div
              //   to={href}
              className={`flex gap-1.5 items-center p-2 cursor-pointer select-none rounded-md transition ${sidebarOpen ? "" : "justify-center"} bg-red-50 hover:bg-red-100 text-red-500`}
            >
              <svg className="w-6 h-6 fill-transparent">
                <use xlinkHref="#icon-plus"></use>
              </svg>
              <span className={`transition ${sidebarOpen ? "" : "hidden"}`}>
               خروج از حساب کاربری
              </span>
            </div> */}
          <MenuItem
            id="test"
            icon="#icon-power"
            onClick={handleLogout}
            classStyle="bg-red-50 hover:bg-red-100 text-red-500"
            classIcon="-rotate-45"
            label="خروج از حساب کاربری"
            sidebarOpen={sidebarOpen}
            permission="view-user"
          />
          {/* </Tooltip> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
