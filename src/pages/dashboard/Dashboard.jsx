// import React from 'react';
// import { useSelector } from 'react-redux';

// const Dashboard = () => {
//     // const user = useSelector((state) => state.user.user)
//     // console.log(user);

//     return (
//         <div>
//             داشبورد

//             <div></div>
//         </div>
//     );
// }

// export default Dashboard;

// import React, { useState, useEffect } from 'react';

// // ============================================
// // 🎯 داده‌های استاتیک (فعلاً برای تست)
// // ============================================
// const STATIC_STATS = {
//     movies: 124,
//     series: 38,
//     watched: 96,
//     unwatched: 66,
//     korean: 27,
//     chinese: 19,
//     totalHours: 342,
//     avgRating: 7.8,
// };

// const STATIC_MONTHLY = [
//     { month: 'فروردین', movies: 8, series: 3 },
//     { month: 'اردیبهشت', movies: 12, series: 5 },
//     { month: 'خرداد', movies: 6, series: 2 },
//     { month: 'تیر', movies: 15, series: 4 },
//     { month: 'مرداد', movies: 10, series: 6 },
//     { month: 'شهریور', movies: 18, series: 7 },
// ];

// const STATIC_ACTIVITIES = [
//     { id: 1, type: 'add', title: 'فیلم «اوپنهایمر» اضافه شد', time: '۵ دقیقه پیش', color: 'blue' },
//     { id: 2, type: 'watch', title: 'سریال «بازی مرکب» تماشا شد', time: '۱ ساعت پیش', color: 'emerald' },
//     { id: 3, type: 'rate', title: 'امتیاز ۹ به «تلما» داده شد', time: '۳ ساعت پیش', color: 'amber' },
//     { id: 4, type: 'add', title: 'فیلم «پارازیت» اضافه شد', time: 'دیروز', color: 'blue' },
// ];

// const STATIC_RECENT = [
//     { id: 1, title: 'اوپنهایمر', year: 2023, type: 'movie', rating: 8.5, color: 'from-blue-500 to-indigo-600' },
//     { id: 2, title: 'بازی مرکب', year: 2021, type: 'series', rating: 8.0, color: 'from-rose-500 to-pink-600' },
//     { id: 3, title: 'پارازیت', year: 2019, type: 'movie', rating: 8.6, color: 'from-emerald-500 to-teal-600' },
//     { id: 4, title: 'وارث', year: 2024, type: 'series', rating: 8.8, color: 'from-amber-500 to-orange-600' },
// ];

// const STATIC_COUNTRIES = [
//     { name: 'کره‌ای', count: 27, percent: 22, color: 'cyan' },
//     { name: 'چینی', count: 19, percent: 15, color: 'amber' },
//     { name: 'آمریکایی', count: 45, percent: 36, color: 'blue' },
//     { name: 'هندی', count: 12, percent: 10, color: 'purple' },
//     { name: 'سایر', count: 21, percent: 17, color: 'slate' },
// ];

// // ============================================
// // 🎨 پالت رنگی
// // ============================================
// const COLORS = {
//     blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    icon: 'text-blue-600',    gradient: 'from-blue-500 to-indigo-600',    ring: 'ring-blue-500' },
//     amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   icon: 'text-amber-600',   gradient: 'from-amber-500 to-orange-600',   ring: 'ring-amber-500' },
//     purple:  { bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-800',  icon: 'text-purple-600',  gradient: 'from-purple-500 to-fuchsia-600', ring: 'ring-purple-500' },
//     emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-600',   ring: 'ring-emerald-500' },
//     rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-800',    icon: 'text-rose-600',    gradient: 'from-rose-500 to-pink-600',      ring: 'ring-rose-500' },
//     cyan:    { bg: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-800',    icon: 'text-cyan-600',    gradient: 'from-cyan-500 to-sky-600',       ring: 'ring-cyan-500' },
//     slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-800',   icon: 'text-slate-600',   gradient: 'from-slate-500 to-gray-600',     ring: 'ring-slate-500' },
//     yellow:  { bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-800',  icon: 'text-yellow-600',  gradient: 'from-yellow-500 to-amber-600',   ring: 'ring-yellow-500' },
// };

// // ============================================
// // 🧩 کامپوننت باکس آماری
// // ============================================
// const StatsBox = ({ title, value, icon, color = 'blue', subtitle, trend, loading = false }) => {
//     const c = COLORS[color] || COLORS.blue;

//     if (loading) {
//         return (
//             <div className={`border-[1.4px] p-4 rounded-2xl ${c.bg} ${c.border}`}>
//                 <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-3"></div>
//                 <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//             </div>
//         );
//     }

//     return (
//         <div className={`group relative overflow-hidden border-[1.4px] p-4 rounded-2xl ${c.bg} ${c.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
//             {/* افکت تزئینی گوشه */}
//             <div className={`absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

//             <div className="flex items-start justify-between relative">
//                 <div className="flex-1">
//                     <div className={`text-xs font-semibold flex items-center gap-x-1 ${c.icon}`}>
//                         <svg className="w-[16px] h-[16px] fill-transparent">
//                             <use xlinkHref={`#${icon}`}></use>
//                         </svg>
//                         <span>{title}</span>
//                     </div>
//                     <div className={`pt-2 font-bold ${c.text}`}>
//                         <span className="text-2xl">{value ?? 0}</span>
//                         {subtitle && (
//                             <span className="text-xs font-normal text-gray-500 mr-1.5">
//                                 {subtitle}
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 {/* آیکون بزرگ گرادیانتی */}
//                 <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
//                     <svg className="w-5 h-5 fill-white text-white">
//                         <use xlinkHref={`#${icon}`}></use>
//                     </svg>
//                 </div>
//             </div>

//             {/* روند تغییرات */}
//             {trend !== undefined && (
//                 <div className="mt-2 flex items-center gap-x-1 text-xs">
//                     <span className={trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
//                         {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
//                     </span>
//                     <span className="text-gray-400">نسبت به ماه قبل</span>
//                 </div>
//             )}
//         </div>
//     );
// };

// // ============================================
// // 📊 نمودار میله‌ای سفارشی
// // ============================================
// const BarChart = ({ data }) => {
//     const max = Math.max(...data.map(d => Math.max(d.movies, d.series)));

//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-x-1.5">
//                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                         <svg className="w-4 h-4 fill-white">
//                             <use xlinkHref="#icon-chart-2-bold-duotone"></use>
//                         </svg>
//                     </div>
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">آمار ماهانه</div>
//                         <div className="text-xs text-gray-500">۶ ماه اخیر</div>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-x-3 text-xs">
//                     <div className="flex items-center gap-x-1">
//                         <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
//                         <span className="text-gray-600">فیلم</span>
//                     </div>
//                     <div className="flex items-center gap-x-1">
//                         <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
//                         <span className="text-gray-600">سریال</span>
//                     </div>
//                 </div>
//             </div>

//             {/* نمودار */}
//             <div className="flex items-end justify-between gap-2 h-40 pt-4">
//                 {data.map((d, i) => (
//                     <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
//                         <div className="flex items-end gap-0.5 h-full w-full justify-center">
//                             {/* میله فیلم */}
//                             <div
//                                 className="w-2.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-500 group-hover:opacity-80"
//                                 style={{ height: `${(d.movies / max) * 100}%` }}
//                                 title={`فیلم: ${d.movies}`}
//                             ></div>
//                             {/* میله سریال */}
//                             <div
//                                 className="w-2.5 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-500 group-hover:opacity-80"
//                                 style={{ height: `${(d.series / max) * 100}%` }}
//                                 title={`سریال: ${d.series}`}
//                             ></div>
//                         </div>
//                         <span className="text-[10px] text-gray-500 font-medium">{d.month}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // ============================================
// // 🍩 نمودار دایره‌ای (Donut)
// // ============================================
// const DonutChart = ({ watched, unwatched }) => {
//     const total = watched + unwatched;
//     const watchedPercent = total > 0 ? (watched / total) * 100 : 0;
//     const radius = 60;
//     const circumference = 2 * Math.PI * radius;
//     const dashOffset = circumference - (watchedPercent / 100) * circumference;

//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             <div className="flex items-center gap-x-1.5 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
//                     <svg className="w-4 h-4 fill-white">
//                         <use xlinkHref="#icon-eye-bold-duotone"></use>
//                     </svg>
//                 </div>
//                 <div>
//                     <div className="text-sm font-bold text-gray-800">وضعیت تماشا</div>
//                     <div className="text-xs text-gray-500">درصد دیده‌شده</div>
//                 </div>
//             </div>

//             <div className="flex items-center justify-center gap-6">
//                 {/* Donut */}
//                 <div className="relative w-36 h-36">
//                     <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
//                         {/* پس‌زمینه */}
//                         <circle
//                             cx="70" cy="70" r={radius}
//                             fill="none"
//                             stroke="#e5e7eb"
//                             strokeWidth="12"
//                         />
//                         {/* مقدار */}
//                         <circle
//                             cx="70" cy="70" r={radius}
//                             fill="none"
//                             stroke="url(#donutGradient)"
//                             strokeWidth="12"
//                             strokeLinecap="round"
//                             strokeDasharray={circumference}
//                             strokeDashoffset={dashOffset}
//                             className="transition-all duration-1000"
//                         />
//                         <defs>
//                             <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                                 <stop offset="0%" stopColor="#10b981" />
//                                 <stop offset="100%" stopColor="#14b8a6" />
//                             </linearGradient>
//                         </defs>
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <span className="text-2xl font-bold text-emerald-600">
//                             {watchedPercent.toFixed(0)}%
//                         </span>
//                         <span className="text-xs text-gray-500">دیده‌شده</span>
//                     </div>
//                 </div>

//                 {/* Legend */}
//                 <div className="flex flex-col gap-3">
//                     <div>
//                         <div className="flex items-center gap-x-1.5 mb-1">
//                             <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
//                             <span className="text-xs text-gray-600">دیده شده</span>
//                         </div>
//                         <div className="text-lg font-bold text-emerald-600">{watched}</div>
//                     </div>
//                     <div>
//                         <div className="flex items-center gap-x-1.5 mb-1">
//                             <span className="w-3 h-3 rounded-full bg-gray-300"></span>
//                             <span className="text-xs text-gray-600">دیده نشده</span>
//                         </div>
//                         <div className="text-lg font-bold text-gray-600">{unwatched}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ============================================
// // 🌍 توزیع کشوری
// // ============================================
// const CountryDistribution = ({ data }) => {
//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             <div className="flex items-center gap-x-1.5 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center">
//                     <svg className="w-4 h-4 fill-white">
//                         <use xlinkHref="#icon-global-bold-duotone"></use>
//                     </svg>
//                 </div>
//                 <div>
//                     <div className="text-sm font-bold text-gray-800">توزیع کشوری</div>
//                     <div className="text-xs text-gray-500">بر اساس تعداد محتوا</div>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 {data.map((country, i) => {
//                     const c = COLORS[country.color] || COLORS.blue;
//                     return (
//                         <div key={i}>
//                             <div className="flex items-center justify-between mb-1">
//                                 <div className="flex items-center gap-x-2">
//                                     <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${c.gradient}`}></span>
//                                     <span className="text-sm font-medium text-gray-700">{country.name}</span>
//                                 </div>
//                                 <div className="flex items-center gap-x-2">
//                                     <span className="text-xs text-gray-500">{country.percent}%</span>
//                                     <span className={`text-sm font-bold ${c.text}`}>{country.count}</span>
//                                 </div>
//                             </div>
//                             <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
//                                 <div
//                                     className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700`}
//                                     style={{ width: `${country.percent}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // ============================================
// // ⏱️ فعالیت‌های اخیر (Timeline)
// // ============================================
// const RecentActivities = ({ activities }) => {
//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             <div className="flex items-center gap-x-1.5 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
//                     <svg className="w-4 h-4 fill-white">
//                         <use xlinkHref="#icon-clock-circle-bold-duotone"></use>
//                     </svg>
//                 </div>
//                 <div>
//                     <div className="text-sm font-bold text-gray-800">فعالیت‌های اخیر</div>
//                     <div className="text-xs text-gray-500">آخرین تغییرات</div>
//                 </div>
//             </div>

//             <div className="relative">
//                 {/* خط عمودی */}
//                 <div className="absolute right-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

//                 <div className="flex flex-col gap-4">
//                     {activities.map((act, i) => {
//                         const c = COLORS[act.color] || COLORS.blue;
//                         const icons = {
//                             add: 'icon-add-circle-bold-duotone',
//                             watch: 'icon-eye-bold-duotone',
//                             rate: 'icon-star-bold-duotone',
//                         };
//                         return (
//                             <div key={act.id} className="flex items-start gap-3 relative">
//                                 <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shrink-0 z-10 ring-4 ring-white`}>
//                                     <svg className="w-4 h-4 fill-white">
//                                         <use xlinkHref={`#${icons[act.type] || 'icon-add-circle-bold-duotone'}`}></use>
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1 pt-0.5">
//                                     <div className="text-sm font-medium text-gray-800">{act.title}</div>
//                                     <div className="text-xs text-gray-400 mt-0.5">{act.time}</div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ============================================
// // 🎬 آخرین اضافه‌شده‌ها
// // ============================================
// const RecentAdded = ({ items }) => {
//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-x-1.5">
//                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
//                         <svg className="w-4 h-4 fill-white">
//                             <use xlinkHref="#icon-clapperboard-play-bold-duotone"></use>
//                         </svg>
//                     </div>
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">آخرین اضافه‌شده‌ها</div>
//                         <div className="text-xs text-gray-500">جدیدترین محتوا</div>
//                     </div>
//                 </div>
//                 <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
//                     مشاهده همه →
//                 </button>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {items.map((item) => (
//                     <div key={item.id} className="group cursor-pointer">
//                         <div className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${item.color} relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-0.5`}>
//                             {/* الگوی تزئینی */}
//                             <div className="absolute inset-0 opacity-20" style={{
//                                 backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)',
//                                 backgroundSize: '30px 30px',
//                             }}></div>

//                             {/* بج نوع */}
//                             <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[10px] text-white font-medium">
//                                 {item.type === 'movie' ? 'فیلم' : 'سریال'}
//                             </div>

//                             {/* امتیاز */}
//                             <div className="absolute bottom-2 left-2 flex items-center gap-x-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
//                                 <svg className="w-3 h-3 fill-yellow-400">
//                                     <use xlinkHref="#icon-star-bold-duotone"></use>
//                                 </svg>
//                                 <span className="text-[10px] text-white font-bold">{item.rating}</span>
//                             </div>

//                             {/* حرف اول */}
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <span className="text-4xl font-bold text-white/90">{item.title.charAt(0)}</span>
//                             </div>
//                         </div>
//                         <div className="mt-2">
//                             <div className="text-xs font-bold text-gray-800 truncate">{item.title}</div>
//                             <div className="text-[10px] text-gray-500">{item.year}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // ============================================
// // 🏠 کامپوننت اصلی Dashboard
// // ============================================
// const Dashboard = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // شبیه‌سازی لود داده
//         const timer = setTimeout(() => {
//             setStats(STATIC_STATS);
//             setLoading(false);
//         }, 800);
//         return () => clearTimeout(timer);
//     }, []);

//     const statsItems = [
//         { title: 'کل فیلم‌ها',        value: stats?.movies,    icon: 'icon-clapperboard-play-bold-duotone', color: 'blue',    trend: 12 },
//         { title: 'کل سریال‌ها',       value: stats?.series,    icon: 'icon-playlist-bold-duotone',          color: 'purple',  trend: 8 },
//         { title: 'دیده شده',          value: stats?.watched,   icon: 'icon-eye-bold-duotone',               color: 'emerald', trend: 15 },
//         { title: 'دیده نشده',         value: stats?.unwatched, icon: 'icon-eye-closed-bold-duotone',        color: 'rose',    trend: -5 },
//         { title: 'فیلم‌های کره‌ای',    value: stats?.korean,    icon: 'icon-flag-bold-duotone',              color: 'cyan',    trend: 3 },
//         { title: 'فیلم‌های چینی',     value: stats?.chinese,   icon: 'icon-flag-bold-duotone',              color: 'amber',   trend: 6 },
//     ];

//     return (
//         <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen" dir="rtl">
//             {/* ========== هدر ========== */}
//             <div className="relative overflow-hidden bg-gradient-to-l from-indigo-600 via-purple-600 to-fuchsia-600 rounded-2xl p-5 md:p-6 mb-5 text-white shadow-lg">
//                 {/* افکت تزئینی */}
//                 <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
//                 <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

//                 <div className="relative flex items-center justify-between flex-wrap gap-4">
//                     <div>
//                         <div className="flex items-center gap-x-2 mb-1">
//                             <svg className="w-5 h-5 fill-white/80">
//                                 <use xlinkHref="#icon-chart-2-bold-duotone"></use>
//                             </svg>
//                             <span className="text-xs text-white/80 font-medium">داشبورد مدیریت</span>
//                         </div>
//                         <h1 className="text-xl md:text-2xl font-bold mb-1">
//                             خوش آمدی، محمدجواد 👋
//                         </h1>
//                         <p className="text-sm text-white/80">
//                             خلاصه‌ای از آمار فیلم‌ها و سریال‌های تو
//                         </p>
//                     </div>

//                     {/* آمار سریع */}
//                     <div className="flex items-center gap-3">
//                         <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
//                             <div className="text-[10px] text-white/70">مجموع</div>
//                             <div className="text-lg font-bold">{stats?.movies + stats?.series || 0}</div>
//                         </div>
//                         <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
//                             <div className="text-[10px] text-white/70">ساعت تماشا</div>
//                             <div className="text-lg font-bold">{stats?.totalHours || 0}</div>
//                         </div>
//                         <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
//                             <div className="text-[10px] text-white/70">میانگین امتیاز</div>
//                             <div className="text-lg font-bold">{stats?.avgRating || 0}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ========== باکس‌های آماری ========== */}
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
//                 {statsItems.map((item, idx) => (
//                     <StatsBox key={idx} {...item} loading={loading} />
//                 ))}
//             </div>

//             {/* ========== نمودارها ========== */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
//                 <div className="lg:col-span-2">
//                     <BarChart data={STATIC_MONTHLY} />
//                 </div>
//                 <DonutChart
//                     watched={stats?.watched || 0}
//                     unwatched={stats?.unwatched || 0}
//                 />
//             </div>

//             {/* ========== توزیع کشوری + فعالیت‌ها ========== */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
//                 <CountryDistribution data={STATIC_COUNTRIES} />
//                 <RecentActivities activities={STATIC_ACTIVITIES} />
//             </div>

//             {/* ========== آخرین اضافه‌شده‌ها ========== */}
//             <RecentAdded items={STATIC_RECENT} />
//         </div>
//     );
// };

// export default Dashboard;

import React, { useState, useEffect, useMemo, useRef } from "react";
import jMoment from "moment-jalaali";
import {
  getDashboardStatsService,
  getDashboardMonthlyService,
  getDashboardCountriesService,
  getDashboardActivitiesService,
  getDashboardRecentAddedService,
} from "@/services/dashboard";

// تنظیم moment-jalaali برای فارسی
jMoment.loadPersian({ usePersianDigits: false, dialect: "persian" });

// ============================================
// 🎨 پالت رنگی
// ============================================
const COLORS = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-800",
    icon: "text-purple-600",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    icon: "text-rose-600",
    gradient: "from-rose-500 to-pink-600",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-800",
    icon: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-800",
    icon: "text-cyan-600",
    gradient: "from-cyan-500 to-sky-600",
  },
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    icon: "text-slate-600",
    gradient: "from-slate-500 to-gray-600",
  },
};

// ============================================
// 🎨 Helper: رنگ کشور
// ============================================
const getCountryColor = (country) => {
  const map = {
    southKorea: "cyan",
    china: "amber",
  };
  return map[country] || "blue";
};

const getCountryGradient = (country) => {
  const map = {
    southKorea: "from-cyan-500 to-sky-600",
    china: "from-amber-500 to-orange-600",
  };
  return map[country] || "from-blue-500 to-indigo-600";
};

// ============================================
// 📅 Helper: تبدیل timestamp به "X دقیقه پیش"
// ============================================
const timeAgo = (timestamp) => {
  return jMoment(timestamp).fromNow();
};

// ============================================
// 🧩 StatsBox
// ============================================
const StatsBox = ({ title, value, icon, color = "blue", loading = false }) => {
  const c = COLORS[color] || COLORS.blue;

  if (loading) {
    return (
      <div className={`border-[1.4px] p-4 rounded-2xl ${c.bg} ${c.border}`}>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-3"></div>
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden border-[1.4px] p-4 rounded-2xl ${c.bg} ${c.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div
        className={`absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
      ></div>

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <div
            className={`text-xs font-semibold flex items-center gap-x-1 ${c.icon}`}
          >
            <svg className="w-[16px] h-[16px] fill-transparent">
              <use xlinkHref={`#${icon}`}></use>
            </svg>
            <span>{title}</span>
          </div>
          <div className={`pt-2 font-bold ${c.text}`}>
            <span className="text-2xl">{value ?? 0}</span>
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}
        >
          <svg className="w-5 h-5 fill-transparent text-white">
            <use xlinkHref={`#${icon}`}></use>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 📊 BarChart — محاسبه کامل توی فرانت
// ============================================
// ============================================
// 📊 BarChart — با Tooltip زیبا و تفکیک کشوری
// ============================================
const BarChart = ({ movies, loading }) => {
  const chartData = useMemo(() => {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = jMoment().startOf("jMonth").subtract(i, "jMonth");

      months.push({
        key: `${date.jYear()}-${date.jMonth() + 1}`,
        label: date.format("jMMMM"),
        year: date.jYear(),
        month: date.jMonth() + 1,
        movies: 0,
        series: 0,
        moviesKorean: 0,
        moviesChinese: 0,
        seriesKorean: 0,
        seriesChinese: 0,
      });
    }

    if (movies?.length) {
      movies.forEach((movie) => {
        const date = jMoment(movie.created_at);
        const year = date.jYear();
        const month = date.jMonth() + 1;

        const target = months.find(
          (item) => item.year === year && item.month === month,
        );

        if (!target) return;

        const isKorean = movie.country === "southKorea";
        const isChinese = movie.country === "china";

        if (movie.type === "movie") {
          target.movies++;
          if (isKorean) target.moviesKorean++;
          if (isChinese) target.moviesChinese++;
        }

        if (movie.type === "series") {
          target.series++;
          if (isKorean) target.seriesKorean++;
          if (isChinese) target.seriesChinese++;
        }
      });
    }

    return months;
  }, [movies]);

  const max = Math.max(
    ...chartData.map((item) => Math.max(item.movies, item.series)),
    1,
  );

  return (
    <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-1.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 fill-transparent text-white">
              <use xlinkHref="#icon-chart" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">آمار ماهانه</div>
            <div className="text-xs text-gray-500">۶ ماه شمسی اخیر</div>
          </div>
        </div>

        <div className="flex items-center gap-x-3 text-xs">
          <div className="flex items-center gap-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-gray-600">فیلم</span>
          </div>
          <div className="flex items-center gap-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-gray-600">سریال</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-end justify-around gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-3 bg-gray-200 animate-pulse rounded"
                style={{ height: "60%" }}
              />
              <div className="h-2 w-8 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3 h-48 pt-4">
          {chartData.map((item) => (
            <div
              key={item.key}
              className="flex-1 flex flex-col items-center gap-1 group/bar h-full"
            >
              {/* 👇 بخش میله‌ها با relative برای Tooltip */}
              <div className="relative flex items-end gap-1 h-full w-full justify-center cursor-pointer">
                {/* 👇 Tooltip — دقیقاً بالای میله بلندتر */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 opacity-0 pointer-events-none group-hover/bar:opacity-100 group-hover/bar:-translate-y-1 transition-all duration-200">
                  <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-3 min-w-[170px] border border-gray-200">
                    {/* فلش پایین tooltip */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-200"></div>

                    {/* هدر: اسم ماه */}
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-800">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        {item.year}
                      </span>
                    </div>

                    {/* فیلم‌ها */}
                    {item.movies > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-x-1.5 mb-1">
                          <div className="relative flex">
                            <span className="absolute w-2 h-2 rounded-full animate-ping bg-indigo-500"></span>
                            <span className="relative w-2 h-2 rounded-full bg-indigo-500"></span>
                          </div>
                          <span className="text-[11px] font-semibold text-indigo-600">
                            فیلم‌ها ({item.movies})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pr-3">
                          {item.moviesKorean > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                              🇰🇷 {item.moviesKorean} کره‌ای
                            </span>
                          )}
                          {item.moviesChinese > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              🇨🇳 {item.moviesChinese} چینی
                            </span>
                          )}
                          {item.moviesKorean === 0 &&
                            item.moviesChinese === 0 && (
                              <span className="text-[10px] text-gray-400">
                                بدون تفکیک
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    {/* سریال‌ها */}
                    {item.series > 0 && (
                      <div>
                        <div className="flex items-center gap-x-1.5 mb-1">
                          <div className="relative flex">
                          <span className="absolute w-2 h-2 rounded-full animate-ping bg-purple-500"></span>
                          <span className="relative w-2 h-2 rounded-full bg-purple-500"></span>
                          </div>
                          <span className="text-[11px] font-semibold text-purple-600">
                            سریال‌ها ({item.series})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pr-3">
                          {item.seriesKorean > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                              🇰🇷 {item.seriesKorean} کره‌ای
                            </span>
                          )}
                          {item.seriesChinese > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              🇨🇳 {item.seriesChinese} چینی
                            </span>
                          )}
                          {item.seriesKorean === 0 &&
                            item.seriesChinese === 0 && (
                              <span className="text-[10px] text-gray-400">
                                بدون تفکیک
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    {item.movies === 0 && item.series === 0 && (
                      <div className="text-[11px] text-gray-400 text-center py-1">
                        محتوایی ثبت نشده
                      </div>
                    )}
                  </div>
                </div>

                {/* فیلم */}
                <div
                  className="w-3.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-500 group-hover/bar:from-indigo-500 group-hover/bar:to-indigo-300 group-hover/bar:shadow-lg group-hover/bar:shadow-indigo-500/50"
                  style={{
                    height:
                      item.movies > 0 ? `${(item.movies / max) * 100}%` : "0%",
                    minHeight: item.movies > 0 ? "6px" : "0",
                  }}
                />

                {/* سریال */}
                <div
                  className="w-3.5 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-500 group-hover/bar:from-purple-400 group-hover/bar:to-purple-200 group-hover/bar:shadow-lg group-hover/bar:shadow-purple-500/50"
                  style={{
                    height:
                      item.series > 0 ? `${(item.series / max) * 100}%` : "0%",
                    minHeight: item.series > 0 ? "6px" : "0",
                  }}
                />
              </div>

              <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap group-hover/bar:text-gray-800 group-hover/bar:font-bold transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 🍩 DonutChart
// ============================================
const DonutChart = ({ watched, unwatched }) => {
  const total = watched + unwatched;
  const watchedPercent = total > 0 ? (watched / total) * 100 : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (watchedPercent / 100) * circumference;

  return (
    <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-x-1.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <svg className="w-4 h-4 fill-transparent text-white">
            <use xlinkHref="#icon-eye"></use>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">وضعیت تماشا</div>
          <div className="text-xs text-gray-500">درصد دیده‌شده</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="url(#donutGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="donutGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-emerald-600">
              {watchedPercent.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">دیده‌شده</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-x-1.5 mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-gray-600">دیده شده</span>
            </div>
            <div className="text-lg font-bold text-emerald-600">{watched}</div>
          </div>
          <div>
            <div className="flex items-center gap-x-1.5 mb-1">
              <span className="w-3 h-3 rounded-full bg-gray-300"></span>
              <span className="text-xs text-gray-600">دیده نشده</span>
            </div>
            <div className="text-lg font-bold text-gray-600">{unwatched}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 🍩 DonutChartCountry — هم‌ظاهر با DonutChart + تفکیک کشوری
// ============================================
// const DonutChartCountry = ({ stats, loading }) => {
//     const radius = 60;
//     const circumference = 2 * Math.PI * radius;
//     const strokeWidth = 12;

//     // 🎬 انیمیشن ورود
//     const [animated, setAnimated] = useState(false);
//     useEffect(() => {
//         if (!loading) {
//             const t = setTimeout(() => setAnimated(true), 100);
//             return () => clearTimeout(t);
//         } else {
//             setAnimated(false);
//         }
//     }, [loading, stats]);

//     // محاسبه داده‌ها
//     const data = useMemo(() => {
//         const koreanMovies  = stats?.koreanMovies  || 0;
//         const koreanSeries  = stats?.koreanSeries  || 0;
//         const chineseMovies = stats?.chineseMovies || 0;
//         const chineseSeries = stats?.chineseSeries || 0;

//         const total = koreanMovies + koreanSeries + chineseMovies + chineseSeries;
//         if (total === 0) {
//             return { total: 0, segments: [], korean: 0, chinese: 0, koreanPercent: 0, chinesePercent: 0 };
//         }

//         // 👇 ترتیب: کره‌ای‌ها کنار هم، چینی‌ها کنار هم
//         const rawSegments = [
//             { key: 'koreanMovies',  label: 'فیلم کره‌ای',  value: koreanMovies,  color: '#06b6d4', flag: '🇰🇷' },
//             { key: 'koreanSeries',  label: 'سریال کره‌ای', value: koreanSeries,  color: '#0ea5e9', flag: '🇰🇷' },
//             { key: 'chineseMovies', label: 'فیلم چینی',   value: chineseMovies, color: '#f59e0b', flag: '🇨🇳' },
//             { key: 'chineseSeries', label: 'سریال چینی',  value: chineseSeries, color: '#f97316', flag: '🇨🇳' },
//         ].filter((s) => s.value > 0);

//         // 👇 یه gap خیلی ظریف بین سگمنت‌ها (۰.۶ درصد کل دایره)
//         const gapPercent = rawSegments.length > 1 ? 0.8 : 0;

//         // محاسبه dash هر سگمنت
//         let cumulative = 0;
//         const segments = rawSegments.map((seg, idx) => {
//             const percent = (seg.value / total) * 100;
//             const dashPercent = Math.max(percent - gapPercent, 0.5); // حداقل ۰.۵٪
//             const dash = (dashPercent / 100) * circumference;
//             const offset = circumference - (cumulative / 100) * circumference;
//             cumulative += percent;
//             return { ...seg, percent, dash, offset };
//         });

//         return {
//             total,
//             segments,
//             korean: koreanMovies + koreanSeries,
//             chinese: chineseMovies + chineseSeries,
//             koreanPercent: ((koreanMovies + koreanSeries) / total) * 100,
//             chinesePercent: ((chineseMovies + chineseSeries) / total) * 100,
//         };
//     }, [stats, circumference]);

//     return (
//         <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//             {/* هدر — دقیقاً مثل DonutChart */}
//             <div className="flex items-center gap-x-1.5 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-amber-500 flex items-center justify-center">
//                     <svg className="w-4 h-4 fill-white">
//                         <use xlinkHref="#icon-global-bold-duotone"></use>
//                     </svg>
//                 </div>
//                 <div>
//                     <div className="text-sm font-bold text-gray-800">توزیع کشوری</div>
//                     <div className="text-xs text-gray-500">کره‌ای و چینی در یک نگاه</div>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="flex items-center justify-center gap-6">
//                     <div className="w-36 h-36 rounded-full bg-gray-200 animate-pulse"></div>
//                     <div className="flex flex-col gap-3">
//                         {[1, 2, 3, 4].map((i) => (
//                             <div key={i} className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
//                         ))}
//                     </div>
//                 </div>
//             ) : data.total === 0 ? (
//                 <div className="text-center text-sm text-gray-500 py-10">
//                     داده‌ای موجود نیست
//                 </div>
//             ) : (
//                 <div className="flex items-center justify-center gap-6">
//                     {/* دایره — دقیقاً مثل DonutChart */}
//                     <div className="relative w-36 h-36 shrink-0">
//                         <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
//                             {/* پس‌زمینه */}
//                             <circle
//                                 cx="70" cy="70" r={radius}
//                                 fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
//                             />

//                             {/* سگمنت‌ها — با انیمیشن ورود */}
//                             {data.segments.map((seg, idx) => (
//                                 <circle
//                                     key={seg.key}
//                                     cx="70" cy="70" r={radius}
//                                     fill="none"
//                                     stroke={seg.color}
//                                     strokeWidth={strokeWidth}
//                                     strokeLinecap="butt"
//                                     strokeDasharray={`${animated ? seg.dash : 0} ${circumference}`}
//                                     strokeDashoffset={seg.offset}
//                                     style={{
//                                         transition: `stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.15}s`,
//                                     }}
//                                 />
//                             ))}
//                         </svg>

//                         {/* مرکز دایره — مثل DonutChart */}
//                         <div className="absolute inset-0 flex flex-col items-center justify-center">
//                             <span className="text-2xl font-bold text-gray-800">
//                                 {data.total}
//                             </span>
//                             <span className="text-xs text-gray-500">کل محتوا</span>
//                         </div>
//                     </div>

//                     {/* راهنما — مثل DonutChart */}
//                     <div className="flex flex-col gap-3">
//                         {/* خلاصه کره‌ای */}
//                         <div>
//                             <div className="flex items-center gap-x-1.5 mb-1">
//                                 <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
//                                 <span className="text-xs text-gray-600">🇰🇷 کره‌ای</span>
//                             </div>
//                             <div className="flex items-baseline gap-x-2">
//                                 <span className="text-lg font-bold text-cyan-600">
//                                     {data.korean}
//                                 </span>
//                                 <span className="text-[10px] text-gray-400">
//                                     {data.koreanPercent.toFixed(1)}%
//                                 </span>
//                             </div>
//                         </div>

//                         {/* خلاصه چینی */}
//                         <div>
//                             <div className="flex items-center gap-x-1.5 mb-1">
//                                 <span className="w-3 h-3 rounded-full bg-amber-500"></span>
//                                 <span className="text-xs text-gray-600">🇨🇳 چینی</span>
//                             </div>
//                             <div className="flex items-baseline gap-x-2">
//                                 <span className="text-lg font-bold text-amber-600">
//                                     {data.chinese}
//                                 </span>
//                                 <span className="text-[10px] text-gray-400">
//                                     {data.chinesePercent.toFixed(1)}%
//                                 </span>
//                             </div>
//                         </div>

//                         {/* تفکیک دقیق — کوچیک زیرش */}
//                         <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
//                             {data.segments.map((seg) => (
//                                 <div key={seg.key} className="flex items-center justify-between gap-3">
//                                     <div className="flex items-center gap-x-1.5">
//                                         <span
//                                             className="w-2 h-2 rounded-full shrink-0"
//                                             style={{ backgroundColor: seg.color }}
//                                         ></span>
//                                         <span className="text-[10px] text-gray-500">
//                                             {seg.flag} {seg.label}
//                                         </span>
//                                     </div>
//                                     <span className="text-[10px] font-bold text-gray-700">
//                                         {seg.value}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

const DonutChartCountry = ({ stats, loading }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 12;

  const [animated, setAnimated] = useState(false);
  // 🌟 برای track کردن سگمنت hover شده
  const [hoveredKey, setHoveredKey] = useState(null);
  // 🌟 برای موقعیت mouse
  // const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const tooltipContainerRef = useRef(null);

  // 🌟 موقعیت Tooltip
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }
    setAnimated(false);
  }, [loading, stats]);

  // خطوط نورانی
  const highlights = useMemo(() => {
    const total = 6;
    const duration = 8;

    return Array.from({ length: total }, (_, i) => {
      const delay = -(i * duration) / total;
      const lengths = [22, 14, 30, 10, 18, 8];
      const maxOpacities = [0.95, 0.8, 0.55, 0.9, 0.7, 0.5];
      const minOpacities = [0.15, 0.1, 0.08, 0.12, 0.1, 0.08];
      const baseWidths = [2.5, 2.0, 1.8, 2.2, 2.0, 1.5];

      return {
        id: i + 1,
        length: lengths[i % lengths.length],
        duration,
        delay,
        maxOpacity: maxOpacities[i % maxOpacities.length],
        minOpacity: minOpacities[i % minOpacities.length],
        baseWidth: baseWidths[i % baseWidths.length],
      };
    });
  }, []);

  const data = useMemo(() => {
    const koreanMovies = stats?.koreanMovies || 0;
    const koreanSeries = stats?.koreanSeries || 0;
    const chineseMovies = stats?.chineseMovies || 0;
    const chineseSeries = stats?.chineseSeries || 0;

    const total = koreanMovies + koreanSeries + chineseMovies + chineseSeries;

    if (total === 0) return { total: 0, segments: [] };

    const rawSegments = [
      {
        key: "koreanMovies",
        label: "فیلم کره‌ای",
        value: koreanMovies,
        color: "#06b6d4",
        textColor: "text-cyan-600",
        flag: "🇰🇷",
      },
      {
        key: "koreanSeries",
        label: "سریال کره‌ای",
        value: koreanSeries,
        color: "#0ea5e9",
        textColor: "text-sky-600",
        flag: "🇰🇷",
      },
      {
        key: "chineseMovies",
        label: "فیلم چینی",
        value: chineseMovies,
        color: "#f59e0b",
        textColor: "text-amber-600",
        flag: "🇨🇳",
      },
      {
        key: "chineseSeries",
        label: "سریال چینی",
        value: chineseSeries,
        color: "#f97316",
        textColor: "text-orange-600",
        flag: "🇨🇳",
      },
    ].filter((item) => item.value > 0);

    const gap = rawSegments.length > 1 ? 2 : 0;
    let cumulative = 0;

    const segments = rawSegments.map((segment) => {
      const percent = (segment.value / total) * 100;
      const fullLength = (percent / 100) * circumference;
      const dash = Math.max(fullLength - gap, 1);
      const offset = cumulative;
      cumulative += fullLength;

      // 🌟 آمار تفکیکی از بک‌اند
      const breakdown = stats?.breakdown?.[segment.key] || {
        total: segment.value,
        watched: 0,
        unwatched: segment.value,
        liked: 0,
        unliked: segment.value,
      };

      return { ...segment, percent, dash, offset, breakdown };
    });

    return { total, segments };
  }, [stats, circumference]);

  // 🌟 پیدا کردن سگمنت hover شده
  const hoveredSegment = useMemo(
    () => data.segments.find((s) => s.key === hoveredKey),
    [data.segments, hoveredKey],
  );

  const updateTooltipPosition = (event) => {
    const container = tooltipContainerRef.current;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    // const targetRect = event.currentTarget.getBoundingClientRect();

    // setTooltipPos({
    //   x: targetRect.left + targetRect.width / 2 - containerRect.left,
    //   y: targetRect.top - containerRect.top,
    // });
    setTooltipPos({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    });
  };

  return (
    <div
      ref={tooltipContainerRef}
      className="relative bg-white border-[1.4px] border-gray-200 rounded-2xl p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-x-1.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-amber-500 flex items-center justify-center">
          <svg className="w-4 h-4 fill-transparent text-white">
            <use xlinkHref="#icon-global" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">توزیع کشوری</div>
          <div className="text-xs text-gray-500">آمار فیلم و سریال</div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-6">
          <div className="w-36 h-36 rounded-full bg-gray-200 animate-pulse" />
          {/* <div className="flex flex-col gap-3"> */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-24 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      ) : data.total === 0 ? (
        <div className="text-center text-sm text-gray-500 py-10">
          داده‌ای موجود نیست
        </div>
      ) : (
        <div className="flex items-center justify-center gap-7">
          {/* DONUT */}
          <div className="relative w-36 h-36 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Background */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />

              {/* Soft Glow */}
              {data.segments.map((segment, index) => (
                <circle
                  key={`glow-${segment.key}`}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth + 5}
                  strokeLinecap="round"
                  strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                  strokeDashoffset={-segment.offset}
                  className={animated ? "donut-country-soft-glow" : ""}
                  style={{ "--segment-delay": `${index * 0.25}s` }}
                />
              ))}

              {/* Main Segments — با hover */}
              {data.segments.map((segment, index) => (
                <circle
                  key={segment.key}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={
                    hoveredKey === segment.key ? strokeWidth + 3 : strokeWidth
                  }
                  strokeLinecap="round"
                  strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                  strokeDashoffset={-segment.offset}
                  className={animated ? "donut-country-main" : ""}
                  style={{
                    "--segment-delay": `${index * 0.25}s`,
                    transition: "stroke-width 0.25s ease, filter 0.25s ease",
                    cursor: "pointer",
                    filter:
                      hoveredKey === segment.key
                        ? `drop-shadow(0 0 8px ${segment.color})`
                        : hoveredKey
                          ? "brightness(0.7) saturate(0.6)"
                          : "none",
                    opacity:
                      hoveredKey && hoveredKey !== segment.key ? 0.35 : 1,
                  }}
                  onMouseEnter={(e) => {
                    setHoveredKey(segment.key);
                    updateTooltipPosition(e);
                  }}
                  onMouseMove={updateTooltipPosition}
                  onMouseLeave={() => setHoveredKey(null)}
                />
              ))}

              {/* Highlights */}
              {animated &&
                highlights.map((h) => (
                  <circle
                    key={h.id}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,1)"
                    strokeWidth={h.baseWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${h.length} ${circumference - h.length}`}
                    strokeDashoffset={0}
                    className="donut-country-orbit"
                    style={{
                      "--orbit-duration": `${h.duration}s`,
                      "--orbit-delay": `${h.delay}s`,
                      "--orbit-max-opacity": h.maxOpacity,
                      "--orbit-min-opacity": h.minOpacity,
                      "--orbit-base-width": h.baseWidth,
                    }}
                  />
                ))}
            </svg>

            {/* Center — وقتی hover نیست */}
            {/* {!hoveredSegment && ( */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">
                {data.total}
              </span>
              <span className="text-xs text-gray-500">کل محتوا</span>
            </div>
            {/* )} */}

            {/* 🌟 Tooltip — وقتی hover هست */}
          </div>

          {/* STATISTICS */}
          {/* <div className="flex flex-col justify-center gap-2.5 min-w-[155px]"> */}
          <div className="grid grid-cols-2 justify-center gap-x-10 gap-y-4 min-w-[155px]">
            {data.segments.map((segment) => (
              <div
                key={segment.key}
                className="group/stat cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredKey(segment.key);
                  updateTooltipPosition(e);
                }}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div className="flex items-center gap-x-1.5 mb-0.5">
                  <div className="relative justify-center items-center flex">
                    <span
                      className="absolute w-2 h-2 rounded-xs shrink-0 animate-ping transition-all duration-300 group-hover/stat:scale-125"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span
                      className="relative w-2.5 h-2.5 rounded-xs shrink-0 transition-all duration-300 group-hover/stat:scale-125"
                      style={{ backgroundColor: segment.color }}
                    />
                  </div>
                  <div className="flex gap-0.5 text-xs text-gray-600 whitespace-nowrap">
                    <span>{segment.flag}</span>
                    <span>{segment.label}</span>
                  </div>
                  {/* <span className="text-xs text-gray-600 whitespace-nowrap">
                     
                  </span> */}
                </div>
                <div className="flex items-baseline gap-x-2">
                  <span
                    className={`text-lg font-bold ${segment.textColor} transition-transform duration-300 group-hover/stat:-translate-x-0.5`}
                  >
                    {segment.value}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {segment.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hoveredSegment && (
            <div
              className="absolute z-30 pointer-events-none"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                transform: "translate(-50%, -110%)",
              }}
            >
              <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-3 min-w-[190px] border border-gray-200">
                {/* فلش پایین */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-200"></div>

                {/* هدر */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {hoveredSegment.flag} {hoveredSegment.label}
                  </span>
                  <span
                    className="text-[10px] text-white px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: hoveredSegment.color }}
                  >
                    {hoveredSegment.percent.toFixed(1)}%
                  </span>
                </div>

                {/* آمار: کل */}
                <div className="mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-4 h-4 fill-transparent"
                        style={{ color: hoveredSegment.color }}
                      >
                        <use xlinkHref="#icon-pie-chart-2-bold-duotone"></use>
                      </svg>
                      <span className="text-[10px] font-bold text-gray-500">
                        کل
                      </span>
                    </div>
                    {/* <span className="text-[11px] text-gray-500">📊 کل</span> */}
                    <span
                      className="text-sm font-bold"
                      style={{ color: hoveredSegment.color }}
                    >
                      {hoveredSegment.breakdown.total}
                    </span>
                  </div>
                </div>

                {/* دیده‌شده / دیده‌نشده */}
                <div className="mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-x-1.5 mb-1">
                    <div className="relative flex">
                      <span className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="relative w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      دیده‌شده
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-3 mb-1">
                    {/* <span className="text-[10px] text-gray-500">✅ دیده‌شده</span> */}
                    <div className="flex items-center gap-0.5">
                      <svg className="w-[14px] h-[14px] fill-transparent text-green-500">
                        <use xlinkHref="#icon-eye-bold-duotone"></use>
                      </svg>
                      <span className="text-[10px] font-medium text-gray-500">
                        دیده‌شده
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500">
                      {hoveredSegment.breakdown.watched}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-3">
                    {/* <span className="text-[10px] text-gray-500">
                        👁️ دیده‌نشده
                      </span> */}
                    <div className="flex items-center gap-0.5">
                      <svg className="w-[14px] h-[14px] fill-transparent text-red-500">
                        <use xlinkHref="#icon-eye-closed-bold-duotone"></use>
                      </svg>
                      <span className="text-[10px] font-medium text-gray-500">
                        دیده‌نشده
                      </span>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      {hoveredSegment.breakdown.unwatched}
                    </span>
                  </div>
                </div>

                {/* پسندیده / پسندیده‌نشده */}
                <div>
                  <div className="flex items-center gap-x-1.5 mb-1">
                    <div className="relative flex">
                      <span className="absolute w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="relative w-2 h-2 rounded-full bg-rose-500"></span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600">
                      پسندها
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-3 mb-1">
                    {/* <span className="text-[10px] text-gray-500">
                        ❤️ پسندیده
                      </span> */}
                    <div className="flex items-center gap-0.5">
                      <svg className="w-[14px] h-[14px] fill-transparent text-green-500">
                        <use xlinkHref="#icon-heart-bold-duotone"></use>
                      </svg>
                      <span className="text-[10px] font-medium text-gray-500">
                        پسندیده
                      </span>
                    </div>
                    <span className="text-xs font-bold text-green-500">
                      {hoveredSegment.breakdown.liked}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-3">
                    {/* <span className="text-[10px] text-gray-500">
                        🤍 پسندیده‌نشده
                      </span> */}
                    <div className="flex items-center gap-0.5">
                      <svg className="w-[14px] h-[14px] fill-transparent text-red-500">
                        <use xlinkHref="#icon-heart-broken-bold-duotone"></use>
                      </svg>
                      <span className="text-[10px] font-medium text-gray-500">
                        پسندیده‌نشده
                      </span>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      {hoveredSegment.breakdown.unliked}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// export default DonutChartCountry;

// ============================================
// 🌍 CountryDistribution — محاسبه توی فرانت
// ============================================
// const CountryDistribution = ({ data, loading }) => {
//   // محاسبه درصدها توی فرانت
//   const countries = useMemo(() => {
//     if (!data || data.total === 0) return [];

//     return [
//       {
//         key: "korean",
//         name: "کره‌ای",
//         count: data.korean,
//         percent: ((data.korean / data.total) * 100).toFixed(1),
//         color: "cyan",
//       },
//       {
//         key: "chinese",
//         name: "چینی",
//         count: data.chinese,
//         percent: ((data.chinese / data.total) * 100).toFixed(1),
//         color: "amber",
//       },
//     ];
//   }, [data]);

//   return (
//     <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
//       <div className="flex items-center gap-x-1.5 mb-4">
//         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center">
//           <svg className="w-4 h-4 fill-transparent text-white">
//             <use xlinkHref="#icon-global"></use>
//           </svg>
//         </div>
//         <div>
//           <div className="text-sm font-bold text-gray-800">توزیع کشوری</div>
//           <div className="text-xs text-gray-500">بر اساس تعداد محتوا</div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex flex-col gap-3">
//           {[1, 2].map((i) => (
//             <div key={i}>
//               <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
//               <div className="h-1.5 bg-gray-200 animate-pulse rounded-full"></div>
//             </div>
//           ))}
//         </div>
//       ) : countries.length === 0 ? (
//         <div className="text-center text-sm text-gray-500 py-6">
//           داده‌ای موجود نیست
//         </div>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {countries.map((country, i) => {
//             const c = COLORS[country.color] || COLORS.blue;
//             return (
//               <div key={i}>
//                 <div className="flex items-center justify-between mb-1">
//                   <div className="flex items-center gap-x-2">
//                     <span
//                       className={`w-2 h-2 rounded-full bg-gradient-to-br ${c.gradient}`}
//                     ></span>
//                     <span className="text-sm font-medium text-gray-700">
//                       {country.name}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-x-2">
//                     <span className="text-xs text-gray-500">
//                       {country.percent}%
//                     </span>
//                     <span className={`text-sm font-bold ${c.text}`}>
//                       {country.count}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
//                   <div
//                     className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700`}
//                     style={{ width: `${country.percent}%` }}
//                   ></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

const useCountUp = (target, duration = 1200, start = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      setCount(eased * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
};

const CountryBar = ({ country, colors, index }) => {
  const [mounted, setMounted] = useState(false);
  const animatedCount = useCountUp(country.count, 1200, mounted);
  const animatedPercent = useCountUp(
    parseFloat(country.percent),
    1200,
    mounted,
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + index * 150);
    return () => clearTimeout(t);
  }, [index]);

  const c = colors[country.color] || colors.blue;

  return (
    <div className="group">
      {/* هدر نوار */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-x-2">
          {/* نقطه با ping + glow */}
          {/* <span className="relative flex w-2.5 h-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-gradient-to-br ${c.gradient} opacity-60 animate-ping`}
            />
            <span
              className={`relative inline-flex w-2.5 h-2.5 rounded-full bg-gradient-to-br ${c.gradient} shadow-[0_0_8px_currentColor]`}
            />
          </span> */}
          <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
            {country.name}
          </span>
        </div>

        <div className="flex items-center gap-x-2">
          <span className="text-xs text-gray-500 tabular-nums">
            {animatedPercent.toFixed(1)}%
          </span>
          <span className={`text-sm font-bold tabular-nums ${c.text}`}>
            {Math.round(animatedCount).toLocaleString("fa-IR")}
          </span>
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="relative w-full bg-gray-100/80 rounded-full h-2 overflow-hidden">
        <div className="absolute inset-0 rounded-full shadow-inner" />

        {/* نوار رنگی */}
        <div
          className={`relative h-full rounded-full bg-gradient-to-r ${c.gradient}
            bg-[length:200%_100%] animate-gradient-shift
            shadow-[0_0_12px_-2px_currentColor]
            transition-[width] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
          style={{ width: mounted ? `${country.percent}%` : "0%" }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full animate-shimmer
                bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>

          {/* Stripe */}
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-stripe-move"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 6px, transparent 6px 12px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Tip Dot */}
          {/* <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
              w-3 h-3 rounded-full bg-white
              shadow-[0_0_10px_2px_currentColor]
              ring-2 ring-white/60
              transition-opacity duration-500"
            style={{ opacity: mounted ? 1 : 0 }}
          /> */}
        </div>
      </div>
    </div>
  );
};

const CountryDistribution = ({ data, loading }) => {
  const countries = useMemo(() => {
    if (!data || data.total === 0) return [];
    return [
      {
        key: "korean",
        name: "کره‌ای",
        count: data.korean,
        percent: ((data.korean / data.total) * 100).toFixed(1),
        color: "cyan",
      },
      {
        key: "chinese",
        name: "چینی",
        count: data.chinese,
        percent: ((data.chinese / data.total) * 100).toFixed(1),
        color: "amber",
      },
    ];
  }, [data]);

  return (
    <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-x-1.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center">
          <svg className="w-4 h-4 fill-transparent text-white">
            <use xlinkHref="#icon-global"></use>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">توزیع کشوری</div>
          <div className="text-xs text-gray-500">بر اساس تعداد محتوا</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-2 bg-gray-200 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      ) : countries.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-6">
          داده‌ای موجود نیست
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {countries.map((country, i) => (
            <CountryBar
              key={country.key}
              country={country}
              colors={COLORS}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// ⏱️ RecentActivities — متن توی فرانت ساخته می‌شه
// ============================================
const RecentActivities = ({ activities, loading }) => {
  const icons = {
    add: "icon-add-circle-bold-duotone",
    watch: "icon-eye-bold-duotone",
    unwatch: "icon-eye-closed-bold-duotone",
    rate: "icon-star-bold-duotone",
    like: "icon-like-bold-duotone",
    unlike: "icon-dislike-bold-duotone",
  };

  const colorMap = {
    add: "blue",
    watch: "emerald",
    unwatch: "slate",
    rate: "amber",
    like: "orange",
    unlike: "slate",
  };

  // 👇 ساخت متن توی فرانت
  const buildTitle = (act) => {
    const contentType = act.content_type === "movie" ? "فیلم" : "سریال";

    switch (act.type) {
      case "add":
        return `${contentType} «${act.title}» اضافه شد`;
      case "watch":
        return `${contentType} «${act.title}» تماشا شد`;
      case "unwatch":
        return `تماشای ${contentType} «${act.title}» لغو شد`;
      case "rate":
        return `امتیاز ${act.rating} به «${act.title}» داده شد`;
      case "like":
        return `${contentType} «${act.title}» لایک شد`;
      case "unlike":
        return `لایک ${contentType} «${act.title}» برداشته شد`;
      default:
        return act.title;
    }
  };

  return (
    <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-x-1.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
          <svg className="w-4 h-4 fill-transparent text-white">
            <use xlinkHref="#icon-history"></use>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">فعالیت‌های اخیر</div>
          <div className="text-xs text-gray-500">آخرین تغییرات</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities?.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-6">
          فعالیتی ثبت نشده است
        </div>
      ) : (
        <div className="relative max-h-44 scrollbar-thin overflow-y-auto pl-1">
          <div className="absolute right-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
          <div className="flex flex-col gap-4">
            {activities?.map((act) => {
              const c = COLORS[colorMap[act.type]] || COLORS.blue;
              return (
                <div key={act.id} className="flex items-start gap-3 relative">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shrink-0 z-10 ring-4 ring-white`}
                  >
                    <svg className="w-4 h-4 fill-transparent text-white">
                      <use
                        xlinkHref={`#${icons[act.type] || "icon-add-circle-bold-duotone"}`}
                      ></use>
                    </svg>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="text-sm font-medium text-gray-800">
                      {buildTitle(act)}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {timeAgo(act.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎬 RecentAdded — رنگ توی فرانت
// ============================================
const RecentAdded = ({ items, loading }) => {
  return (
    <div className="bg-white border-[1.4px] border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-1.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
            <svg className="w-4 h-4 fill-transparent text-white">
              <use xlinkHref="#icon-clapperboard-play"></use>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">
              آخرین اضافه‌شده‌ها
            </div>
            <div className="text-xs text-gray-500">جدیدترین محتوا</div>
          </div>
        </div>
        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          مشاهده همه →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-gray-200 animate-pulse"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded mt-2 w-3/4"></div>
              </div>
            ))
          : items?.map((item) => {
              const gradient = getCountryGradient(item.country);
              return (
                <div key={item.id} className="group cursor-pointer">
                  <div
                    className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${gradient} relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-0.5`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/90">
                          {item.title?.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[10px] text-white font-medium">
                      {item.type === "movie" ? "فیلم" : "سریال"}
                    </div>

                    {item.rating && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-x-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                        <svg className="w-3 h-3 fill-yellow-400">
                          <use xlinkHref="#icon-star-bold-duotone"></use>
                        </svg>
                        <span className="text-[10px] text-white font-bold">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-gray-800 truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-gray-500">{item.year}</div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

// ============================================
// 🏠 Dashboard اصلی
// ============================================
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [countries, setCountries] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentAdded, setRecentAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, monthlyRes, countriesRes, activitiesRes, recentRes] =
        await Promise.all([
          getDashboardStatsService(),
          getDashboardMonthlyService(),
          getDashboardCountriesService(),
          getDashboardActivitiesService(10),
          getDashboardRecentAddedService(4),
        ]);

      setStats(statsRes?.data?.data);
      setMovies(monthlyRes?.data?.data || []);
      setCountries(countriesRes?.data?.data);
      setActivities(activitiesRes?.data?.data || []);
      setRecentAdded(recentRes?.data?.data || []);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsItems = [
    {
      title: "کل فیلم‌ها",
      value: stats?.movies,
      icon: "icon-clapperboard-play-bold-duotone",
      color: "blue",
    },
    {
      title: "کل سریال‌ها",
      value: stats?.series,
      icon: "icon-clapperboard-play-bold-duotone",
      color: "purple",
    },
    {
      title: "دیده شده",
      value: stats?.watched,
      icon: "icon-eye-bold-duotone",
      color: "emerald",
    },
    {
      title: "دیده نشده",
      value: stats?.unwatched,
      icon: "icon-eye-closed-bold-duotone",
      color: "rose",
    },
    {
      title: "فیلم‌های کره‌ای",
      value: stats?.korean,
      icon: "icon-video-frame-play-vertical-bold-duotone",
      color: "cyan",
    },
    {
      title: "فیلم‌های چینی",
      value: stats?.chinese,
      icon: "icon-video-frame-play-horizontal-bold-duotone",
      color: "amber",
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen select-none" dir="rtl">
      {/* هدر */}
      <div className="relative overflow-hidden bg-gradient-to-l from-indigo-600 via-purple-600 to-fuchsia-600 rounded-2xl p-5 md:p-6 mb-5 text-white shadow-lg">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-x-2 mb-1">
              <svg className="w-5 h-5 fill-transparent text-white">
                <use xlinkHref="#icon-home-angle-bold-duotone"></use>
              </svg>
              <span className="text-xs text-white/80 font-medium">
                داشبورد مدیریت
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">خوش آمدید</h1>
            <p className="text-sm text-white/80">
              خلاصه‌ای از آمار فیلم‌ها و سریال‌های تو
            </p>
          </div>

          <div className="flex items-center gap-3 *:flex *:flex-col *:items-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <div className="text-[10px] text-white/70">مجموع</div>
              <div className="text-lg font-bold">{stats?.total || 0}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <div className="text-[10px] text-white/70">لایک شده</div>
              <div className="text-lg font-bold">{stats?.liked || 0}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <div className="text-[10px] text-white/70">میانگین امتیاز</div>
              <div className="text-lg font-bold">{stats?.avgRating || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* باکس‌های آماری */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        {statsItems.map((item, idx) => (
          <StatsBox key={idx} {...item} loading={loading} />
        ))}
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <div className="lg:col-span-2">
          <BarChart movies={movies} loading={loading} />
        </div>
        {/* <DonutChart
          watched={stats?.watched || 0}
          unwatched={stats?.unwatched || 0}
        /> */}
        <DonutChartCountry stats={stats} loading={loading} />
      </div>

      {/* 🆕 نمودار کشوری جدید */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <div className="lg:col-span-2">
          <DonutChartCountry stats={stats} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          می‌تونی اینجا خالی بذاری یا بعداً پر کنی
        </div>
      </div> */}

      {/* توزیع کشوری + فعالیت‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <CountryDistribution data={countries} loading={loading} />
        <RecentActivities activities={activities} loading={loading} />
      </div>

      {/* آخرین اضافه‌شده‌ها */}
      {/* <RecentAdded items={recentAdded} loading={loading} /> */}
    </div>
  );
};

export default Dashboard;
