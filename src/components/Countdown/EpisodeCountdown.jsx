// // src/components/Countdown/EpisodeCountdown.jsx

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import CountdownUnit from "./CountdownUnit";

// /**
//  * شمارشگر معکوس قسمت بعدی
//  *
//  * @param {number} secondsTill   ثانیه باقی‌مانده (از API)
//  * @param {number} episodeNumber شماره قسمت بعدی
//  * @param {string} airdateFa     تاریخ پخش فارسی
//  */
// const EpisodeCountdown = ({
//   secondsTill,
//   episodeNumber,
//   airdateFa,
// }) => {
//   // local state برای tick هر ثانیه
//   const [remaining, setRemaining] = useState(secondsTill ?? 0);
//   const initialRef = useRef(secondsTill ?? 0);
//   const mountedAtRef = useRef(Date.now());

//   // reset وقتی secondsTill عوض شد
//   useEffect(() => {
//     initialRef.current = secondsTill ?? 0;
//     mountedAtRef.current = Date.now();
//     setRemaining(secondsTill ?? 0);
//   }, [secondsTill]);

//   // tick هر ثانیه
//   useEffect(() => {
//     if (!secondsTill || secondsTill <= 0) return;

//     const timer = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - mountedAtRef.current) / 1000);
//       const next = Math.max(0, initialRef.current - elapsed);
//       setRemaining(next);

//       if (next <= 0) clearInterval(timer);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [secondsTill]);

//   // محاسبه روز/ساعت/دقیقه/ثانیه
//   const { days, hours, minutes, seconds } = useMemo(() => {
//     const total = Math.max(0, remaining);
//     return {
//       days: Math.floor(total / 86400),
//       hours: Math.floor((total % 86400) / 3600),
//       minutes: Math.floor((total % 3600) / 60),
//       seconds: total % 60,
//     };
//   }, [remaining]);

//   if (!secondsTill || secondsTill <= 0) {
//     return null;
//   }

//   return (
//     <div className="relative overflow-hidden rounded-2xl p-4 md:p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
//       {/* بک‌گراند تزئینی */}
//       <div className="absolute inset-0 opacity-20 pointer-events-none">
//         <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl" />
//         <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl" />
//       </div>

//       <div className="relative z-10 flex flex-col gap-3">
//         {/* هدر */}
//         <div className="flex items-center justify-between flex-wrap gap-2">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//             <span className="text-white/90 text-sm md:text-base font-semibold">
//               پخش قسمت بعدی
//             </span>
//           </div>
//           <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs md:text-sm font-bold border border-white/20">
//             قسمت {episodeNumber}
//           </span>
//         </div>

//         {/* شمارشگر */}
//         <div
//           className="flex items-center justify-center gap-2 md:gap-4 flex-wrap"
//           dir="ltr"
//         >
//           <CountdownUnit value={days} label="روز" />
//           <span className="text-2xl md:text-3xl font-bold text-white/40">:</span>
//           <CountdownUnit value={hours} label="ساعت" />
//           <span className="text-2xl md:text-3xl font-bold text-white/40">:</span>
//           <CountdownUnit value={minutes} label="دقیقه" />
//           <span className="text-2xl md:text-3xl font-bold text-white/40">:</span>
//           <CountdownUnit value={seconds} label="ثانیه" />
//         </div>

//         {/* تاریخ */}
//         {airdateFa && (
//           <div className="text-center text-white/80 text-xs md:text-sm">
//             📅 {airdateFa}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EpisodeCountdown;

// src/components/Countdown/EpisodeCountdown.jsx

// src/components/Countdown/EpisodeCountdown.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import jMoment from "moment-jalaali";
import CountdownUnit from "./CountdownUnit";

const EpisodeCountdown = ({
  secondsTill,
  episodeNumber,
  airdate,         // ⬅️ ISO تاریخ (از بک‌اند)
  scheduleTextFa,  // ⬅️ برنامه پخش (اختیاری)
}) => {
  const [remaining, setRemaining] = useState(secondsTill ?? 0);
  const initialRef = useRef(secondsTill ?? 0);
  const mountedAtRef = useRef(Date.now());

  useEffect(() => {
    initialRef.current = secondsTill ?? 0;
    mountedAtRef.current = Date.now();
    setRemaining(secondsTill ?? 0);
  }, [secondsTill]);

  useEffect(() => {
    if (!secondsTill || secondsTill <= 0) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - mountedAtRef.current) / 1000);
      const next = Math.max(0, initialRef.current - elapsed);
      setRemaining(next);

      if (next <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsTill]);

  const { days, hours, minutes, seconds } = useMemo(() => {
    const total = Math.max(0, remaining);
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }, [remaining]);

  // ⬇️⬇️⬇️ تاریخ شمسی با moment-jalaali ⬇️⬇️⬇️
  const airdateFa = useMemo(() => {
    if (!airdate) return null;
    try {
      return jMoment(airdate).format("dddd jD jMMMM ساعت HH:mm");
      // → "یکشنبه 10 آبان ساعت 11:44"
    } catch {
      return null;
    }
  }, [airdate]);

  if (!secondsTill || secondsTill <= 0) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm select-none">
      {/* عنوان */}
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-orange-400 opacity-75 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-700">
            قسمت {episodeNumber} · پخش بعدی
          </span>

          {/* تاریخ شمسی */}
          {airdateFa && (
            <span className="text-[10px] text-gray-500">
              {airdateFa}
            </span>
          )}

          {/* برنامه پخش (اختیاری) */}
          {/* {scheduleTextFa && (
            <span className="text-[10px] text-gray-400">
              📅 {scheduleTextFa}
            </span>
          )} */}
        </div>
      </div>

      {/* شمارشگر */}
      <div className="flex items-center gap-1.5" dir="ltr">
        <CountdownUnit value={days} label="روز" />
        <span className="text-indigo-300 font-bold text-sm pb-3">:</span>
        <CountdownUnit value={hours} label="ساعت" />
        <span className="text-indigo-300 font-bold text-sm pb-3">:</span>
        <CountdownUnit value={minutes} label="دقیقه" />
        <span className="text-indigo-300 font-bold text-sm pb-3">:</span>
        <CountdownUnit value={seconds} label="ثانیه" />
      </div>
    </div>
  );
};

export default EpisodeCountdown;