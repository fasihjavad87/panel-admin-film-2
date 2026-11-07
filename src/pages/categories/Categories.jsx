import React from 'react';
import { Outlet } from 'react-router-dom';
import CategoriesTable from './categoryList/CategoriesTable';

const Categories = () => {
    return (
        <div>
            <CategoriesTable />
            <Outlet />
        </div>
    );
}

export default Categories;
