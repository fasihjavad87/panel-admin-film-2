// // src/components/Countdown/CountdownUnit.jsx

// import React from "react";
// import CountdownDigit from "./CountdownDigit";

// /**
//  * یه واحد (روز، ساعت، دقیقه، ثانیه) — همیشه دو رقم
//  */
// const CountdownUnit = ({ value, label, pad = 2 }) => {
//   const str = String(Math.max(0, value)).padStart(pad, "0");
//   const digits = str.split("");

//   return (
//     <div className="flex flex-col items-center gap-1">
//       <div className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg min-w-[70px]">
//         {digits.map((d, i) => (
//           <span
//             key={i}
//             className="text-3xl md:text-4xl font-bold text-white tabular-nums"
//           >
//             <CountdownDigit value={d} />
//           </span>
//         ))}
//       </div>
//       <span className="text-xs md:text-sm text-white/70 font-medium">
//         {label}
//       </span>
//     </div>
//   );
// };

// export default CountdownUnit;

// src/components/Countdown/CountdownUnit.jsx

// src/components/Countdown/CountdownUnit.jsx

import React from "react";
import CountdownDigit from "./CountdownDigit";

const CountdownUnit = ({ value, label, pad = 2 }) => {
  const str = String(Math.max(0, value)).padStart(pad, "0");
  const digits = str.split("");

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center justify-center gap-0.5 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 min-w-[42px] h-[34px]">
        {digits.map((d, i) => (
          <span
            key={i}
            // ⬇️⬇️⬇️ inline-flex + items-center + justify-center ⬇️⬇️⬇️
            className="inline-flex items-center justify-center text-lg font-bold text-indigo-700 tabular-nums leading-none"
          >
            <CountdownDigit value={d} />
          </span>
        ))}
      </div>
      <span className="text-[10px] text-gray-500 font-medium">{label}</span>
    </div>
  );
};

export default CountdownUnit;