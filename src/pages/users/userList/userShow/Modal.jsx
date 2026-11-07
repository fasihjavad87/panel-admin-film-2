import React, { useEffect, useRef, useState } from 'react';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { useNavigate, useParams } from 'react-router-dom';
import { getSinglrUserService } from '@/services/users';
import Loading from '@/components/ui/Loading';
import jMoment from "moment-jalaali";
import { getRoleText, getRoleBadge, getStatusText, getStatusBadge } from './core';

const Modal = () => {

    const navigate = useNavigate
        ()
    const modalRef = useRef(null);
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        modalRef.current?.open()
        handleGetUser()
    }, []);

    const handleGetUser = async () => {
        setLoading(true);
        try {
            const res = await getSinglrUserService(id)
            if (res?.data?.data) {
                // console.log(res);
                setUser(res.data.data)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }


    return (
        <ModalsContainer2
            ref={modalRef}
            id="show_user_modal"
            title={loading ? (
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : (
                `اطلاعات ${user?.name || ""}`
            )}
            // fullScreen
            isFooter={false}
            closeOnOutsideClick={false}
            width='max-w-2xl'
            onClose={() => {
                navigate(-1);
            }}
        >
            <div className=''>
                {loading ? (
                    // <div className="flex justify-center items-center h-20">
                    //     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    // </div>
                    // <Loading text={null}/>
                    <div className="flex flex-col items-center">

                        <div className="flex gap-2">
                            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
                            <span
                                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            ></span>
                            <span
                                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            ></span>
                        </div>
                    </div>
                ) : user ? (
                    <div className='flex flex-col gap-2.5'>
                        <div className='flex items-center p-2.5 rounded-lg gap-2.5 bg-gray-50 border-[1.4px] border-gray-200'>
                            <img className='w-[70px] h-[70px] rounded-full border-[1.4px] border-gray-200' src={user.avatar_url} alt={user.avatar} />
                            <span className='truncate'>{user.avatar}</span>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className="bg-blue-50 border-[1.4px] border-blue-200 p-3 rounded-lg">
                                <div className="text-sm text-blue-600 flex items-center gap-x-0.5">
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref="#icon-user-rounded-bold-duotone"></use>
                                    </svg>
                                    <span className="font-semibold">نام</span>
                                </div>
                                <div className="text-base pt-1 font-bold text-blue-800">
                                    {user.name}
                                </div>
                                {/* <div className="text-sm text-blue-600">
                                    {user.email}
                                </div> */}
                            </div>
                            <div className="bg-amber-50 border-[1.4px] border-amber-200 p-3 rounded-lg">
                                <div className="text-sm text-amber-600 flex items-center gap-x-0.5">
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref="#icon-letter-bold-duotone"></use>
                                    </svg>
                                    <span className="font-semibold">ایمیل</span>
                                </div>
                                <div className="text-base pt-1 font-bold text-amber-800">
                                    {user.email}
                                </div>
                            </div>
                            <div className="bg-orange-50 border-[1.4px] border-orange-200 p-3 rounded-lg">
                                <div className="text-sm text-orange-600 flex items-center gap-x-0.5">
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref="#icon-letter-bold-duotone"></use>
                                    </svg>
                                    <span className="font-semibold">نام کاربری</span>
                                </div>
                                <div className="text-base pt-1 font-bold text-orange-800">
                                    {user.username}
                                </div>
                            </div>
                            <div className={`border-[1.4px] p-3 rounded-lg ${getStatusBadge(user.status).bg}`}>
                                <div className={`text-sm flex items-center gap-x-0.5 ${getStatusBadge(user.status).iconColor}`}>
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref={`#${getStatusBadge(user.status).icon}`}></use>
                                    </svg>
                                    <span className="font-semibold">وضعیت</span>
                                </div>
                                <div className={`text-base pt-1 font-bold ${getStatusBadge(user.status).text}`}>
                                    {getStatusText(user.status)}
                                </div>
                            </div>
                            <div className={`border-[1.4px] p-3 rounded-lg ${getRoleBadge(user.is_admin).bg}`}>
                                <div className={`text-sm flex items-center gap-x-0.5 ${getRoleBadge(user.is_admin).iconColor}`}>
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref={`#${getRoleBadge(user.is_admin).icon}`}></use>
                                    </svg>
                                    <span className="font-semibold">دسترسی</span>
                                </div>
                                <div className={`text-base pt-1 font-bold ${getRoleBadge(user.is_admin).text}`}>
                                    {getRoleText(user.is_admin)}
                                </div>
                            </div>
                            <div className="bg-teal-50 border-[1.4px] border-teal-200 p-3 rounded-lg">
                                <div className="text-sm text-teal-600 flex items-center gap-x-0.5">
                                    <svg className="w-[19px] h-[19px] fill-transparent">
                                        <use xlinkHref="#icon-calendar-bold-duotone"></use>
                                    </svg>
                                    <span className="font-semibold">تاریخ ثبت نام</span>
                                </div>
                                <div className="text-base pt-1 font-bold text-teal-800">
                                    {jMoment(user.created_at).format("jYYYY/jM/jD HH:mm:ss")}
                                </div>
                            </div>
                        </div>

                        {
                            user.roles && user.roles.length > 0 && (
                                <div className="bg-purple-50 border-[1.4px] border-purple-200 p-3 rounded-lg">
                                    <div className="text-sm text-purple-600 flex items-center gap-x-0.5">
                                        <svg className="w-[19px] h-[19px] fill-transparent">
                                            <use xlinkHref="#icon-shield-user-bold-duotone"></use>
                                        </svg>
                                        <span className="font-semibold">نقش ها</span>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-2">
                                        {
                                            user.roles.map((r, idx) => (
                                                <div key={`role${idx}`} className="bg-purple-50 border-[1.4px] border-purple-200 p-3 rounded-lg">
                                                    <div className="text-sm text-purple-600 flex items-center gap-x-0.5">
                                                        <svg className="w-[19px] h-[19px] fill-transparent">
                                                            <use xlinkHref="#icon-shield-keyhole-minimalistic-bold-duotone"></use>
                                                        </svg>
                                                        <div className='flex gap-x-1'>
                                                            <span className="font-semibold font-bold">{r.name}</span>
                                                            <span>|</span>
                                                            <span className="font-semibold">{r.title}</span>
                                                        </div>
                                                    </div>
                                                    {r.permissions && r.permissions.length > 0 && (
                                                        <div className="pt-2 flex flex-wrap gap-2">
                                                            {r.permissions.map((p, pdx) => (
                                                                <span key={`permission${pdx}`} className='px-2 py-1 text-xs rounded-full border  text-purple-600 border-purple-600 whitespace-nowrap'>
                                                                    {p.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        کاربری یافت نشد
                    </div>
                )}


            </div>
        </ModalsContainer2 >
    );
}

export default Modal;
