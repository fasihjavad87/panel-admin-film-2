// // src/components/Countdown/CountdownDigit.jsx

// import React, { useEffect, useRef, useState } from "react";

// /**
//  * یه رقم با انیمیشن:
//  * وقتی value عوض می‌شه:
//  *  - رقم قبلی به پایین می‌ره (خروج)
//  *  - رقم جدید از بالا میاد (ورود)
//  */
// const CountdownDigit = ({ value }) => {
//   const [current, setCurrent] = useState(value);
//   const [previous, setPrevious] = useState(null);
//   const [animating, setAnimating] = useState(false);

//   const prevRef = useRef(value);

//   useEffect(() => {
//     if (prevRef.current === value) return;

//     setPrevious(prevRef.current);
//     setCurrent(value);
//     setAnimating(true);
//     prevRef.current = value;

//     const timer = setTimeout(() => {
//       setAnimating(false);
//       setPrevious(null);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [value]);

//   return (
//     <span className="relative inline-block w-[0.65em] h-[1.1em] overflow-hidden align-baseline">
//       {/* رقم فعلی (وقتی انیمیشن نیست) */}
//       {!animating && (
//         <span className="absolute inset-0 flex items-center justify-center">
//           {current}
//         </span>
//       )}

//       {/* رقم قبلی: از وسط به پایین */}
//       {animating && previous !== null && (
//         <span
//           key={`prev-${previous}`}
//           className="absolute inset-0 flex items-center justify-center"
//           style={{
//             animation: "digitOutDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
//           }}
//         >
//           {previous}
//         </span>
//       )}

//       {/* رقم جدید: از بالا به وسط */}
//       {animating && (
//         <span
//           key={`curr-${current}`}
//           className="absolute inset-0 flex items-center justify-center"
//           style={{
//             animation:
//               "digitInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
//           }}
//         >
//           {current}
//         </span>
//       )}

//       {/* keyframes */}
//       <style>{`
//         @keyframes digitOutDown {
//           0% {
//             transform: translateY(0);
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(110%);
//             opacity: 0;
//           }
//         }
//         @keyframes digitInFromTop {
//           0% {
//             transform: translateY(-110%);
//             opacity: 0;
//           }
//           100% {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </span>
//   );
// };

// export default CountdownDigit;

// src/components/Countdown/CountdownDigit.jsx

// src/components/Countdown/CountdownDigit.jsx

import React, { useEffect, useRef, useState } from "react";

const CountdownDigit = ({ value }) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(null);
  const [animating, setAnimating] = useState(false);

  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;

    setPrevious(prevRef.current);
    setCurrent(value);
    setAnimating(true);
    prevRef.current = value;

    const timer = setTimeout(() => {
      setAnimating(false);
      setPrevious(null);
    }, 400);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    // ⬇️⬇️⬇️ inline-flex + items-center + justify-center + align-middle ⬇️⬇️⬇️
    <span className="relative inline-flex w-[0.6em] h-[1.1em] overflow-hidden align-middle tabular-nums leading-none items-center justify-center">
      {!animating && (
        <span className="absolute inset-0 flex items-center justify-center leading-none">
          {current}
        </span>
      )}

      {animating && previous !== null && (
        <span
          key={`prev-${previous}`}
          className="absolute inset-0 flex items-center justify-center leading-none"
          style={{
            animation: "digitOutDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {previous}
        </span>
      )}

      {animating && (
        <span
          key={`curr-${current}`}
          className="absolute inset-0 flex items-center justify-center leading-none"
          style={{
            animation:
              "digitInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {current}
        </span>
      )}

      <style>{`
        @keyframes digitOutDown {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }
        @keyframes digitInFromTop {
          0% { transform: translateY(-110%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </span>
  );
};

export default CountdownDigit;