import React, { useContext, useState } from 'react';
import { useSidebar } from './hooks/useSidebar';
import ToggleSubMenuItem from './components/ToggleSubMenuItem';
import ToggleMenuItem from './components/ToggleMenuItem';
import MenuItem from './components/MenuItem';

const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    const [openMenus, setOpenMenus] = useState({});

    const handleToggleMenu = () => {
        setSidebarOpen(false);
    };

    const toggleSubMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <div className={`bg-white border border-gray-300 p-3 fixed min-h-0 overflow-y-auto custom-scrollbar m-1.5 transition-all rounded-md top-0 bottom-0 w-app-sidebar-w transform z-50 flex flex-col ${sidebarOpen ? 'right-0 md:w-app-sidebar-w' : '-right-[calc(var(--spacing-app-sidebar-w)+6px)] md:w-app-sidebar-w-mobile'} md:right-0`}>

            {/* دکمه بستن - ارتفاع ثابت */}
            <div className="flex-shrink-0">
                <button className='hidden' onClick={handleToggleMenu}>
                    click me!
                </button>
            </div>

            {/* بخش قابل اسکرول - اینجا overflow رو اعمال می‌کنیم */}
            <div className="flex-1">
                <ul className='flex flex-col gap-1.5'>
                    {/* <div className='flex flex-col gap-2.5'> */}
                        <MenuItem
                            id="test"
                            icon="#icon-chat-round-dots"
                            label="پیام"
                            sidebarOpen={sidebarOpen}
                        />
                        <MenuItem
                            id="test"
                            icon="#icon-forbidden-circle"
                            label="پیام"
                            sidebarOpen={sidebarOpen}
                            classStyle="bg-purple-50 hover:bg-purple-100 text-purple-500"
                        />
                    {/* </div> */}

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
                            href="/settings/general"
                            classStyle='bg-rose-50 hover:bg-rose-100 text-rose-500'
                            // colorActive="rose"
                        />
                        <ToggleSubMenuItem
                            id="users-roles"
                            icon="#icon-users-group-two-rounded"
                            label="نقش‌های کاربری"
                            href="/users/roles"
                        />
                    </ToggleMenuItem>

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
                            icon="#icon-user"
                            label="لیست کاربران"
                            href="/users"
                        />
                        <ToggleSubMenuItem
                            id="users-settings"
                            icon="#icon-shield-user"
                            label="تنظیمات کاربران"
                            href="/users/settings"
                        />
                        <ToggleSubMenuItem
                            id="users-roles"
                            icon="#icon-users-group-two-rounded"
                            label="نقش‌های کاربری"
                            href="/users/roles"
                        />
                    </ToggleMenuItem>

                    <ToggleMenuItem
                        id="settings3"
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
                            href="/settings/general"
                            classStyle='bg-orange-50 hover:bg-orange-100 text-orange-500'
                            // colorActive="orange"
                        />
                        <ToggleSubMenuItem
                            id="users-roles"
                            icon="#icon-users-group-two-rounded"
                            label="نقش‌های کاربری"
                            href="/users/roles"
                        />
                        <ToggleSubMenuItem
                            id="users-roles"
                            icon="#icon-users-group-two-rounded"
                            label="نقش‌های کاربری"
                            href="/users/roles"
                        />
                        <ToggleSubMenuItem
                            id="users-roles"
                            icon="#icon-users-group-two-rounded"
                            label="نقش‌های کاربری"
                            href="/users/roles"
                        />

                    </ToggleMenuItem>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;