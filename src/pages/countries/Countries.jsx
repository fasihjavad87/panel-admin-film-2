import React from 'react';
import { Outlet } from 'react-router-dom';
import CategoriesTable from './countryList/CountryTable';

const Countries = () => {
    return (
        <div>
            <CategoriesTable />
            <Outlet />
        </div>
    );
}

export default Countries;
