import React, { useContext } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
// import Users from './users/Users';
import { useSidebar } from '@/hooks/useSidebar';
// import AddUser from './users/userModal/AddUser';


const Content = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    return (
        <section
            className={`fixed p-1.5 h-screen custom-scrollbar left-0 overflow-auto transition-[right]  pb-[calc(var(--spacing-app-header-h)+10px)]  top-[calc(var(--spacing-app-header-h)+6px)] right-0 md:right-[calc(var(--spacing-app-sidebar-w)+6px)] ${sidebarOpen ? 'md:right-[calc(var(--spacing-app-sidebar-w)+6px)]' : 'md:right-[calc(var(--spacing-app-sidebar-w-mobile)+6px)]'} `}>
            {/* <Routes>
                <Route path='/users' element={<Users />}>
                    <Route path='add-user' element={<AddUser />} />
                    <Route path='edit-user/:id' element={<AddUser />} />
                </Route>
            </Routes> */}
            <Outlet />
        </section>
    );
}

export default Content;
