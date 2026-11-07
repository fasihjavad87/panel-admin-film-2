import React, { useEffect, useRef, useState } from 'react';
import ModalsContainer2 from '@/components/ModalsContainer2';
import { useNavigate, useParams } from 'react-router-dom';
import { getSinglrRoleService } from '@/services/roles';
import Loading from '@/components/ui/Loading';
import jMoment from "moment-jalaali";

const Modal = () => {

    const navigate = useNavigate
        ()
    const modalRef = useRef(null);
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        modalRef.current?.open()
        handleGetRole()
    }, []);

    const handleGetRole = async () => {
        setLoading(true);
        try {
            const res = await getSinglrRoleService(id)
            if (res?.data?.data) {
                setRole(res.data.data)
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
            id="show_role_modal"
            title={loading ? (
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : (
                `اطلاعات: ${role?.title || ""}`
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
                ) : role ? (
                    <div className='flex flex-col gap-2.5'>

                        <div className="bg-purple-50 border-[1.4px] border-purple-200 p-3 rounded-lg">
                            <div className="text-sm text-purple-600 flex items-center gap-x-0.5">
                                <svg className="w-[19px] h-[19px] fill-transparent">
                                    <use xlinkHref="#icon-shield-keyhole-minimalistic-bold-duotone"></use>
                                </svg>
                                <span className="font-semibold">مجوز ها</span>
                            </div>
                            <div className="pt-2.5 flex flex-col gap-2">
                                {
                                    role.permissions && role.permissions.length > 0 ? (

                                        <div className=" flex flex-wrap gap-2">
                                            {role.permissions.map((p, pdx) => (
                                                <span key={`permission${pdx}`} className='px-2 py-1 text-xs rounded-full border  text-purple-600 border-purple-600 whitespace-nowrap'>
                                                    {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-full py-8 px-4 bg-purple-100 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center gap-1">
                                            <svg className="w-8 h-8 text-purple-500 fill-transparent">
                                                <use xlinkHref="#icon-danger-circle"></use>
                                            </svg>
                                            <span className="text-purple-600 text-sm font-medium">
                                                مجوزی یافت نشد !!!
                                            </span>
                                            <span className="text-purple-500 text-xs">
                                                هیچ دسترسی برای این نقش تعریف نشده است
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        نقش یافت نشد
                    </div>
                )}

            </div>
        </ModalsContainer2 >
    );
}

export default Modal;