import React from 'react';
import UsersTable from './userList/UsersTable';
import { Outlet } from 'react-router-dom';

const Users = () => {
    return (
        <div>
            {/* <h1>داخل داشبورد</h1> */}
            <UsersTable />
            <Outlet />
        </div>
    );
}

export default Users;
