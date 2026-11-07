import React from 'react';
import RolesTable from './roleList/RolesTable';
import { Outlet } from 'react-router-dom';

const Roles = () => {
    return (
        <div>
            <RolesTable />
            <Outlet />
        </div>
    );
}

export default Roles;
