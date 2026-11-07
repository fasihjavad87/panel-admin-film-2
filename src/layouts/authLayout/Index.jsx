import React from 'react';
// import { useIsLogin } from '@/hooks/authHook';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import { useSelector } from 'react-redux';
import Loading from '../../components/ui/Loading';

const Index = () => {
    // const [loading, isLogin] = useIsLogin();
    const { loading, isLogin } = useSelector((state) => state.user)

    if (loading) {
        return <Loading />
    }

    if (isLogin) {
        return (
            <Navigate to='/' replace />
        )
    }

    return (
        <div className="container-login100">
            {/* <Routes>
                    <Route path="/auth/login" element={<Login />} />
                </Routes> */}
            <Outlet />
        </div>
    );
}

export default Index;
