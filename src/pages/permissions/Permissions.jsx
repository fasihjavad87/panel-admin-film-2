import React from 'react';
import { Outlet } from 'react-router-dom';
import PermissionsTable from './permissionList/PermissionsTable';

const Permissions = () => {
    return (
        <div>
            <PermissionsTable />
            <Outlet />
        </div>
    );
}

export default Permissions;
