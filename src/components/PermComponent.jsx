// components/PermComponent.jsx
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useHasPermission } from '@/hooks/useHasPermission';

const PermComponent = ({ component, pTitle, redirectTo = -1 }) => {
    const hasPerm = useHasPermission(pTitle);
    const navigate = useNavigate();
    return hasPerm ? component : <Navigate to='/' replace />
    // return hasPerm ? component : navigate('/', { replace: true })
    // if (!hasPerm) {
    //     // می‌تونی به صفحه قبلی یا صفحه ۴۰۳ برگردونی
    //     return typeof redirectTo === 'number'
    //         ? <Navigate to={redirectTo} replace />
    //         : <Navigate to={redirectTo} replace />;
    // }

    // return component;
};

export default PermComponent;