// import React, { useState, useRef, useLayoutEffect } from "react";
// import { createPortal } from "react-dom";

// const Tooltip2 = ({
//     children,
//     text,
//     placement = "bottom",
//     offset = 8,
// }) => {
//     const [visible, setVisible] = useState(false);
//     const [position, setPosition] = useState({ top: 0, left: 0 });

//     const tooltipRef = useRef(null);
//     const targetRef = useRef(null);

//     useLayoutEffect(() => {
//         if (!visible || !targetRef.current || !tooltipRef.current) return;

//         const target = targetRef.current.getBoundingClientRect();
//         const tooltip = tooltipRef.current.getBoundingClientRect();

//         let top = 0;
//         let left = 0;

//         switch (placement) {
//             case "top":
//                 top = target.top - tooltip.height - offset;
//                 left = target.left + target.width / 2 - tooltip.width / 2;
//                 break;

//             case "right":
//                 top = target.top + target.height / 2 - tooltip.height / 2;
//                 left = target.right + offset;
//                 break;

//             case "left":
//                 top = target.top + target.height / 2 - tooltip.height / 2;
//                 left = target.left - tooltip.width - offset;
//                 break;

//             default:
//                 top = target.bottom + offset;
//                 left = target.left + target.width / 2 - tooltip.width / 2;
//         }

//         setPosition({ top, left });
//     }, [visible, placement, offset]);

//     return (
//         <>
//             <span
//                 ref={targetRef}
//                 onMouseEnter={() => setVisible(true)}
//                 onMouseLeave={() => setVisible(false)}
//                 style={{ display: "inline-flex" }}
//             >
//                 {children}
//             </span>

//             {visible &&
//                 createPortal(
//                     <div
//                         ref={tooltipRef}
//                         style={{
//                             position: "fixed",
//                             top: position.top,
//                             left: position.left,

//                             background: "#222",
//                             color: "#fff",
//                             padding: "4px 12px",
//                             borderRadius: 6,
//                             fontSize: 13,
//                             whiteSpace: "nowrap",
//                             zIndex: 999999,
//                             pointerEvents: "none",
//                             boxShadow: "0 6px 20px rgba(0,0,0,.2)",
//                         }}
//                     >
//                         {text}
//                     </div>,
//                     document.getElementById("modals-root")
//                 )}
//         </>
//     );
// };

// export default Tooltip2;



import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip2 = ({
    children,
    text,

    placement = "bottom",

    offset = 8,

    duration = 180,

    distance = 6,

    timingFunction = "cubic-bezier(.22,1,.36,1)",
}) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const tooltipRef = useRef(null);
    const targetRef = useRef(null);

    //-------------------------
    // Show
    //-------------------------

    const handleMouseEnter = () => {
        setMounted(true);
    };

    //-------------------------
    // Hide
    //-------------------------

    const handleMouseLeave = () => {
        setVisible(false);

        setTimeout(() => {
            setMounted(false);
        }, duration);
    };

    //-------------------------
    // Position
    //-------------------------

    useLayoutEffect(() => {
        if (!mounted) return;

        if (!targetRef.current) return;

        if (!tooltipRef.current) return;

        const target = targetRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
            case "top":
                top = target.top - tooltip.height - offset;
                left = target.left + target.width / 2 - tooltip.width / 2;
                break;

            case "right":
                top = target.top + target.height / 2 - tooltip.height / 2;
                left = target.right + offset;
                break;

            case "left":
                top = target.top + target.height / 2 - tooltip.height / 2;
                left = target.left - tooltip.width - offset;
                break;

            default:
                top = target.bottom + offset;
                left = target.left + target.width / 2 - tooltip.width / 2;
        }

        setPosition({
            top,
            left,
        });

        requestAnimationFrame(() => {
            setVisible(true);
        });

    }, [mounted, placement, offset]);

    //-------------------------
    // Initial Transform
    //-------------------------

    const getTransform = () => {

        if (visible)
            return "translate(0px,0px)";

        switch (placement) {

            case "top":
                return `translateY(${distance}px)`;

            case "bottom":
                return `translateY(-${distance}px)`;

            case "left":
                return `translateX(${distance}px)`;

            case "right":
                return `translateX(-${distance}px)`;

            default:
                return `translateY(-${distance}px)`;
        }

    };


    const trigger = React.cloneElement(children, {
        ref: targetRef,

        onMouseEnter: handleMouseEnter,

        onMouseLeave: handleMouseLeave,
    });

    return (
        <>
            {/* <span
                ref={targetRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                // style={{
                //     display: "inline-flex",
                // }}
            >
                {children}
            </span> */}

            {trigger}
            {
                mounted &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className="bg-black/80"
                        style={{
                            position: "fixed",

                            top: position.top,
                            left: position.left,

                            // background: "#222",
                            color: "#fff",

                            padding: "4px 10px",

                            borderRadius: 6,

                            fontSize: 13,

                            lineHeight: 1.5,

                            whiteSpace: "nowrap",

                            pointerEvents: "none",

                            userSelect: "none",

                            zIndex: 999999,

                            // boxShadow:
                            //     "0 6px 20px rgba(0,0,0,.20)",

                            opacity: visible ? 1 : 0,

                            transform: getTransform(),

                            transition: `
                                opacity ${duration}ms ${timingFunction},
                                transform ${duration}ms ${timingFunction}
                            `,
                        }}
                    >
                        {text}
                    </div>,
                    document.getElementById("modals-root")
                )
            }
        </>
    );
};

export default Tooltip2;