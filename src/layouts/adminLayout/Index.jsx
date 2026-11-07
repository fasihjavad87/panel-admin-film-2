import React, { useState } from 'react';
import { SidebarContext } from '@/context/sidebarContext';
import Header from './navbar/Index';
import Sidebar from './sidebar/Index';
import Content from '@/pages/Content';
// import { useIsLogin } from '@/hooks/authHook';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../../components/ui/Loading';

const Index = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [loading, isLogin] = useIsLogin()

    const { loading, isLogin } = useSelector((state) => state.user)

    if (loading) {
        return <Loading />
    }

    if (!isLogin) {
        return(
            <Navigate to='/auth/login' replace/>
        )
    }

    return (
        <SidebarContext.Provider value={{
            sidebarOpen,
            setSidebarOpen,
        }}>
            {/* {
                loading ? (
                    <h1 className="text-center h-screen">لطفا صبر کنید...</h1>
                ) : isLogin ? (
                    <div> */}
                        <Header />
                        <Content />
                        <Sidebar />
                        {sidebarOpen && (
                            <div
                                className="fixed inset-0 z-40  bg-black/40 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            ></div>
                        )}
                    {/* </div>
                ) : (
                    <Navigate to={'/auth/login'} />
                )} */}
        </SidebarContext.Provider>
    );
}

export default Index;
