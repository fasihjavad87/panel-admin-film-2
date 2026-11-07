// import React, { useEffect, useRef, useState } from 'react';
// import ModalsContainer2 from '@/components/ModalsContainer2';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getSinglrUserService } from '@/services/users';
// import {
//   devicesGetUserService,
//   revokeUserDeviceService,
//   revokeAllUserDevicesService,
// } from '@/services/devices';
// import { toast } from '@/components/Toast/ToastContainer';
// import jMoment from 'moment-jalaali';

// const Modal = () => {
//   const navigate = useNavigate();
//   const modalRef = useRef(null);
//   const { id } = useParams();

//   const [user, setUser] = useState(null);
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [pendingDeviceId, setPendingDeviceId] = useState(null);

//   useEffect(() => {
//     modalRef.current?.open();
//     handleGetData();
//   }, []);

//   const handleGetData = async () => {
//     setLoading(true);
//     try {
//       const [userRes, devicesRes] = await Promise.all([
//         getSinglrUserService(id),
//         devicesGetUserService(id),
//       ]);

//       setUser(userRes.data.data);
//       setDevices(devicesRes.data.devices || []);
//     } catch (error) {
//       console.log(error);
//       toast.error('خطا در دریافت اطلاعات دستگاه‌ها');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRevokeDevice = async (deviceId) => {
//     setPendingDeviceId(deviceId);
//     try {
//       await revokeUserDeviceService(id, deviceId);

//       setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));

//       toast.success('دستگاه با موفقیت از حساب کاربر خارج شد', {
//         duration: 4000,
//       });
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || 'خطا در خروج از دستگاه');
//     } finally {
//       setPendingDeviceId(null);
//     }
//   };

//   const handleRevokeAll = async () => {
//     setActionLoading(true);
//     try {
//       await revokeAllUserDevicesService(id);

//       setDevices([]);

//       toast.success('همه دستگاه‌های کاربر خارج شدند', {
//         duration: 4000,
//       });
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || 'خطا در خروج از همه دستگاه‌ها');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ------- helpers -------
//   const getDeviceIcon = (deviceType, platform) => {
//     const t = (deviceType || platform || '').toLowerCase();
//     if (t.includes('mobile') || t.includes('phone')) return '📱';
//     if (t.includes('tablet')) return '📱';
//     if (t.includes('desktop') || t.includes('windows') || t.includes('mac') || t.includes('linux'))
//       return '💻';
//     return '🌐';
//   };

//   const formatDate = (date) => {
//     if (!date) return '—';
//     try {
//       return jMoment(date).format('jYYYY/jMM/jDD - HH:mm');
//     } catch {
//       return date;
//     }
//   };

//   return (
//     <ModalsContainer2
//       ref={modalRef}
//       id="user_devices_modal"
//       title={
//         loading ? (
//           <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
//         ) : (
//           `دستگاه‌های ${user?.name || ''}`
//         )
//       }
//       fullScreen
//       isFooter={false}
//       onClose={() => navigate(-1)}
//     >
//       <div>
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="flex gap-2">
//               <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
//               <span
//                 className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
//                 style={{ animationDelay: '150ms' }}
//               ></span>
//               <span
//                 className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
//                 style={{ animationDelay: '300ms' }}
//               ></span>
//             </div>
//           </div>
//         ) : user ? (
//           <div className="max-w-6xl mx-auto">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">

//               {/* ================= هدر ================= */}
//               <div className="relative bg-blue-50 px-6 py-5 select-none">
//                 <div className="relative flex items-center justify-between flex-wrap gap-4">
//                   <div className="flex items-center gap-4">
//                     {/* <div className="flex justify-center items-center w-16 h-16 rounded-full border-4 border-blue-500/40 shadow-lg bg-white">
//                       <svg className="w-10 h-10 text-blue-600 fill-transparent">
//                         <use xlinkHref="#icon-monitor-bold-duotone"></use>
//                       </svg>
//                     </div> */}
//                     <div className="relative">
//                                                             <img
//                                                                 src={user.avatar_url || '/default-avatar.png'}
//                                                                 className="w-16 h-16 rounded-full object-cover border-4 border-blue-500/40 shadow-lg"
//                                                                 alt={user.name}
//                                                             />
//                                                         </div>
//                     <div className="text-blue-600">
//                       <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="flex items-center gap-1 text-sm">
//                           <svg className="w-[18px] h-[18px] fill-transparent">
//                             <use xlinkHref="#icon-letter-bold-duotone"></use>
//                           </svg>
//                           {user.email}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="hidden sm:block">
//                     <span className="px-3 py-1 bg-blue-100 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full border border-blue-600">
//                       مدیریت دستگاه‌ها
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* ================= بدنه ================= */}
//               <div className="p-6 space-y-6">

//                 {/* عنوان + شمارنده */}
//                 <div className="flex items-center justify-between select-none flex-wrap gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                       <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-transparent">
//                         <use xlinkHref="#icon-monitor-smartphone-bold-duotone"></use>
//                       </svg>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-800 dark:text-white">
//                         دستگاه‌های فعال کاربر
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {devices.length} دستگاه فعال
//                       </p>
//                     </div>
//                   </div>

//                   {devices.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={handleRevokeAll}
//                       disabled={actionLoading}
//                       className="text-xs px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {/* <svg className="w-4 h-4 fill-transparent">
//                         <use xlinkHref="#icon-logout-bold-duotone"></use>
//                       </svg> */}
//                       <span>{actionLoading ? 'در حال خروج...' : 'خروج از همه دستگاه‌ها'}</span>
//                     </button>
//                   )}
//                 </div>

//                 {/* ================= گرید کارت‌ها ================= */}
//                 {devices.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {devices.map((device) => {
//                       const isPending = pendingDeviceId === device.device_id;
//                       return (
//                         <div
//                           key={device.device_id}
//                           className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex flex-col"
//                         >
//                           {/* هدر کارت */}
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex items-center gap-3">
//                               <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-2xl">
//                                 {getDeviceIcon(device.device_type, device.platform)}
//                               </div>
//                               <div>
//                                 <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
//                                   {device.device_name || 'دستگاه ناشناس'}
//                                 </h4>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                   {device.browser || '—'} • {device.platform || '—'}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>

//                           {/* اطلاعات */}
//                           <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 mb-4 flex-1">
//                             <div className="flex items-center gap-2">
//                               <svg className="w-4 h-4 text-blue-500 fill-transparent flex-shrink-0">
//                                 <use xlinkHref="#icon-clock-circle-bold-duotone"></use>
//                               </svg>
//                               <span className="text-gray-500 dark:text-gray-400">
//                                 آخرین فعالیت:
//                               </span>
//                               <span className="font-medium">
//                                 {formatDate(device.last_active)}
//                               </span>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <svg className="w-4 h-4 text-blue-500 fill-transparent flex-shrink-0">
//                                 <use xlinkHref="#icon-key-bold-duotone"></use>
//                               </svg>
//                               <span className="text-gray-500 dark:text-gray-400">
//                                 توکن‌های فعال:
//                               </span>
//                               <span className="font-medium">
//                                 {device.active_tokens_count ?? '—'}
//                               </span>
//                             </div>
//                           </div>

//                           {/* دکمه خروج */}
//                           <button
//                             type="button"
//                             onClick={() => handleRevokeDevice(device.device_id)}
//                             disabled={isPending}
//                             className="w-full text-xs py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
//                           >
//                             {isPending ? (
//                               <>
//                                 <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
//                                 در حال خروج...
//                               </>
//                             ) : (
//                               <>
//                                 <svg className="w-4 h-4 fill-transparent">
//                                   <use xlinkHref="#icon-logout-bold-duotone"></use>
//                                 </svg>
//                                 خروج از این دستگاه
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 select-none">
//                     <svg className="w-16 h-16 mx-auto text-blue-300 dark:text-blue-700 mb-3 fill-transparent">
//                       <use xlinkHref="#icon-monitor-bold-duotone"></use>
//                     </svg>
//                     <p className="text-gray-500 dark:text-gray-400 font-medium">
//                       هیچ دستگاه فعالی برای این کاربر وجود ندارد
//                     </p>
//                     <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                       تمام نشست‌های این کاربر بسته شده‌اند
//                     </p>
//                   </div>
//                 )}

//                 {/* ================= دکمه بستن ================= */}
//                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
//                   <button
//                     type="button"
//                     onClick={() => navigate(-1)}
//                     className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
//                   >
//                     بستن
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 py-8">کاربری یافت نشد</div>
//         )}
//       </div>
//     </ModalsContainer2>
//   );
// };

// export default Modal;

import React, { useEffect, useRef, useState } from "react";
import ModalsContainer2 from "@/components/ModalsContainer2";
import { useNavigate, useParams } from "react-router-dom";
import { getSinglrUserService } from "@/services/users";
import { openConfirmModal } from "@/components/Modal/modal";
import {
  devicesGetUserService,
  revokeUserDeviceService,
  revokeAllUserDevicesService,
} from "@/services/devices";
import { toast } from "@/components/Toast/ToastContainer";
import jMoment from "moment-jalaali";

// 🌍 لود کردن زبان فارسی برای تاریخ
jMoment.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });

const Modal = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingDeviceId, setPendingDeviceId] = useState(null);

  useEffect(() => {
    modalRef.current?.open();
    handleGetData();
  }, []);

  const handleGetData = async () => {
    setLoading(true);
    try {
      const [userRes, devicesRes] = await Promise.all([
        getSinglrUserService(id),
        devicesGetUserService(id),
      ]);

      setUser(userRes.data.data);
      setDevices(devicesRes.data.devices || []);
    } catch (error) {
      console.log(error);
      toast.error("خطا در دریافت اطلاعات دستگاه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId) => {
    setPendingDeviceId(deviceId);
    try {
      const confirmed = await openConfirmModal({
        title: "خروج از دستگاه",
      message: `آیا از خروج این دستگاه از حساب کاربر "${user.name}" مطمئن هستید؟ پس از خروج، کاربر برای ورود مجدد باید اطلاعات حساب خود را وارد کند.`,
        confirmText:"خارج شود",
        cancelText:"انصراف",
        variant:"danger",
        icon:"logout-2"
      })

      if (!confirmed) return;

      await revokeUserDeviceService(id, deviceId);

      setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));

      toast.success("دستگاه با موفقیت از حساب کاربر خارج شد", {
        duration: 4000,
      });
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message || "خطا در خروج از دستگاه");
    } finally {
      setPendingDeviceId(null);
    }
  };

  const handleRevokeAll = async () => {
    setActionLoading(true);
    try {
      const confirmed = await openConfirmModal({
        title: "خروج از همه دستگاه‌ها",
        message: `آیا از خروج کاربر "${user.name}" از همه دستگاه‌ها مطمئن هستید؟`,
        confirmText: "خارج شود",
        cancelText: "انصراف",
        variant: "danger",
        icon: "logout-2",
      });

      if (!confirmed) return;

      await revokeAllUserDevicesService(id);

      setDevices([]);

      toast.success("همه دستگاه‌های کاربر خارج شدند", {
        duration: 4000,
      });
    } catch (error) {
      // console.log(error);
      toast.error(
        error?.response?.data?.message || "خطا در خروج از همه دستگاه‌ها",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- helpers ----------
  const getDeviceIcon = (deviceType, platform) => {
    const t = (deviceType || platform || "").toLowerCase();

    if (
      t.includes("mobile") ||
      t.includes("phone") ||
      t.includes("android") ||
      t.includes("ios")
    ) {
      return "#icon-smartphone";
    }
    if (t.includes("tablet") || t.includes("ipad")) {
      return "#icon-tablet";
    }
    if (
      t.includes("desktop") ||
      t.includes("windows") ||
      t.includes("mac") ||
      t.includes("linux") ||
      t.includes("pc")
    ) {
      return "#icon-monitor";
    }
    return "#icon-global";
  };

  const getRelativeTime = (date) => {
    if (!date) return "—";

    try {
      const m = jMoment(date);
      const now = jMoment();

      const diffInSeconds = now.diff(m, "seconds");
      const diffInMinutes = now.diff(m, "minutes");
      const diffInHours = now.diff(m, "hours");
      const diffInDays = now.diff(m, "days");

      if (diffInSeconds < 0) return "در آینده";
      if (diffInSeconds < 60) return "همین الان";
      if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
      if (diffInHours < 24) return `${diffInHours} ساعت پیش`;
      if (diffInDays === 1) return "دیروز";
      if (diffInDays < 7) return `${diffInDays} روز پیش`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} هفته پیش`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ماه پیش`;
      return `${Math.floor(diffInDays / 365)} سال پیش`;
    } catch {
      return date;
    }
  };

  return (
    <ModalsContainer2
      ref={modalRef}
      id="user_devices_modal"
      title={
        loading ? (
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          `دستگاه‌های ${user?.name || ""}`
        )
      }
      fullScreen
      isFooter={false}
      onClose={() => navigate(-1)}
    >
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
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
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
              {/* ================= هدر ================= */}
              <div className="relative bg-blue-50 px-6 py-5 select-none">
                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.avatar_url || "/default-avatar.png"}
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-500/40 shadow-lg"
                        alt={user.name}
                      />
                    </div>
                    <div className="text-blue-600">
                      <h2 className="text-xl font-bold tracking-tight">
                        {user.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm">
                          <svg className="w-[18px] h-[18px] fill-transparent">
                            <use xlinkHref="#icon-letter-bold-duotone"></use>
                          </svg>
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <span className="px-3 py-1 bg-blue-100 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full border border-blue-600">
                      مدیریت دستگاه‌ها
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= بدنه ================= */}
              <div className="p-6 space-y-6">
                {/* عنوان + شمارنده */}
                <div className="flex items-center justify-between select-none flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-transparent">
                        <use xlinkHref="#icon-monitor-smartphone-bold-duotone"></use>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        دستگاه‌های فعال کاربر
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {devices.length} دستگاه فعال
                      </p>
                    </div>
                  </div>

                  {devices.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRevokeAll}
                      disabled={actionLoading}
                      className="text-xs px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span>
                        {actionLoading
                          ? "در حال خروج..."
                          : "خروج از همه دستگاه‌ها"}
                      </span>
                    </button>
                  )}
                </div>

                {/* ================= گرید کارت‌ها ================= */}
                {devices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {devices.map((device) => {
                      const isPending = pendingDeviceId === device.device_id;
                      const iconId = getDeviceIcon(
                        device.device_type,
                        device.platform,
                      );

                      return (
                        <div
                          key={device.device_id}
                          className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                        >
                          {/* هدر کارت */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/30 shadow-sm flex-shrink-0">
                              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-transparent">
                                <use xlinkHref={iconId}></use>
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">
                                {device.device_name || "دستگاه ناشناس"}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {device.browser || "—"} •{" "}
                                {device.platform || "—"}
                              </p>
                            </div>
                          </div>

                          {/* اطلاعات */}
                          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 mb-4 flex-1 border-t border-gray-100 dark:border-gray-700 pt-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-500 fill-transparent flex-shrink-0">
                                {/* <use xlinkHref="#icon-clock-circle-bold-duotone"></use> */}
                                <use xlinkHref="#icon-history"></use>
                              </svg>
                              <span className="text-gray-500 dark:text-gray-400">
                                آخرین فعالیت:
                              </span>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {getRelativeTime(device.last_active)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-500 fill-transparent flex-shrink-0">
                                {/* <use xlinkHref="#icon-key-bold-duotone"></use> */}
                                <use xlinkHref="#icon-key"></use>
                              </svg>
                              <span className="text-gray-500 dark:text-gray-400">
                                توکن‌های فعال:
                              </span>
                              <span className="font-semibold text-gray-700 dark:text-gray-200">
                                {device.active_tokens_count ?? "—"}
                              </span>
                            </div>
                          </div>

                          {/* دکمه خروج */}
                          <button
                            type="button"
                            onClick={() => handleRevokeDevice(device.device_id)}
                            disabled={isPending}
                            className="w-full text-xs py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
                          >
                            {isPending ? (
                              <>
                                <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                در حال خروج...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 fill-transparent">
                                  <use xlinkHref="#icon-logout-bold-duotone"></use>
                                </svg>
                                خروج از این دستگاه
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 select-none">
                    <svg className="w-16 h-16 mx-auto text-blue-300 dark:text-blue-700 mb-3 fill-transparent">
                      <use xlinkHref="#icon-monitor-bold-duotone"></use>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      هیچ دستگاه فعالی برای این کاربر وجود ندارد
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      تمام نشست‌های این کاربر بسته شده‌اند
                    </p>
                  </div>
                )}

                {/* ================= دکمه بستن ================= */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 select-none">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">کاربری یافت نشد</div>
        )}
      </div>
    </ModalsContainer2>
  );
};

export default Modal;
