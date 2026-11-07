import React from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { NavLink } from "react-router-dom";
import Tooltip2 from "./Tooltip2";

const ActionIcon = ({
  icon,
  title,
  permission,
  to,
  className,
  placementPosition = "top",
  ...props
}) => {
  const hasPerm = useHasPermission(permission);
  // if (!hasPerm) return null;

  const shouldRender = permission === undefined ? true : hasPerm;

  if (!shouldRender) return null;

  const content = (
    <svg className="w-[22px] h-[22px] fill-transparent">
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );

  if (to) {
    return (
      <Tooltip2 text={title} placement={placementPosition}>
        <NavLink
          to={to}
          className={`p-1.5 rounded-md cursor-pointer transition ${className}`}
          // title={title}
          {...props}
        >
          {content}
        </NavLink>
      </Tooltip2>
    );
  } else {
    return (
      <Tooltip2 text={title} placement={placementPosition}>
        <button
          className={`p-1.5 rounded-md cursor-pointer transition ${className}`}
          // title={title}
          {...props}
        >
          {content}
        </button>
      </Tooltip2>
    );
  }

  // return hasPerm && (
  //     <button
  //         // onClick={() => onView(rowData)}
  //         className={`p-1.5 rounded-md cursor-pointer transition ${className}`}
  //         title={title}
  //         {...props}
  //     >
  //         <svg className="w-[22px] h-[22px] fill-transparent">
  //             <use xlinkHref={`#${icon}`}></use>
  //         </svg>
  //     </button>
  // );
};

export default ActionIcon;
