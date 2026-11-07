// // hooks/useHasPermission.js
// import { useSelector } from "react-redux";

// export const useHasPermission = (pTitle) => {
//   const user = useSelector((state) => state.user.user); // توجه به ساختار state
//   const roles = user?.roles || [];
//   let permissions = [];

//   for (const role of roles) {
//     permissions = [...permissions, ...(role.permissions || [])];
//   }

//   const isAdmin =
//     roles.findIndex((r) => r.title === "admin" || r.name === "admin") > -1;

//   // اگه ادمین باشه، همه دسترسی‌ها رو داره
//   if (isAdmin) return true;

//   // اگه pTitle آرایه باشه
//   if (typeof pTitle === "object" && Array.isArray(pTitle)) {
//     return hasOneOfPerm(permissions, pTitle);
//   }

//   // اگه رشته باشه
//   return (
//     permissions.findIndex(
//       (p) => p.title?.includes(pTitle) || p.name?.includes(pTitle),
//     ) > -1
//   );
// };

// const hasOneOfPerm = (permissions, pTitles) => {
//   for (const pTitle of pTitles) {
//     if (
//       permissions.findIndex(
//         (p) => p.title?.includes(pTitle) || p.name?.includes(pTitle),
//       ) > -1
//     ) {
//       return true;
//     }
//   }
//   return false;
// };

// hooks/useHasPermission.js

// import { useMemo } from "react";
// import { useSelector } from "react-redux";

// export const useHasPermission = (permission) => {
//   const user = useSelector((state) => state.user.user);

//   const roles = user?.roles ?? [];

//   const permissions = useMemo(() => {
//     return roles.flatMap((role) => role.permissions ?? []);
//   }, [roles]);

//   const isAdmin = useMemo(() => {
//     return roles.some((role) => role.name === "admin");
//   }, [roles]);

//   if (!user) return false;

//   if (isAdmin) return true;

//   if (Array.isArray(permission)) {
//     return permission.some((perm) => permissions.some((p) => p.name === perm));
//   }

//   return permissions.some((p) => p.name === permission);
// };

// hooks/useHasPermission.js - نسخه نهایی خیلی ساده
// import { useSelector } from "react-redux";

// export const useHasPermission = (permission) => {
  //   // const user = useSelector((state) => state.user.user);
  
//   // const roles = user?.roles ?? [];
//   const roles =  [{name:'admin'}];

//   const permissions = useMemo(() => {
//     return roles.flatMap((role) => role.permissions ?? []);
//   }, [roles]);

//   const isAdmin = useMemo(() => {
//     return roles.some((role) => role.name === "admin");
//   }, [roles]);

//   // اگر user وجود نداشته باشه
//   // if (!user) return false;

//   // اگر ادمین باشه همه چیز رو می‌تونه ببینه
//   if (isAdmin) return true;

//   // اگر permission معتبر نباشه یا خالی باشه => false
//   if (
//     !permission ||
//     permission === "" ||
//     (Array.isArray(permission) && permission.length === 0)
//   ) {
//     return false;
//   }

//   // اگر آرایه باشه (با آیتم‌های معتبر)
//   if (Array.isArray(permission)) {
//     return permission.some((perm) => permissions.some((p) => p.name === perm));
//   }

//   // اگر string باشه (غیر خالی)
//   return permissions.some((p) => p.name === permission);
// };
// import { useMemo } from "react";
// import { useSelector } from "react-redux";

// export const useHasPermission = (permission) => {
//   const user = useSelector((state) => state.user.user);
//   const roles = useMemo(() => user?.roles ?? [], [user]);

//   console.log(user);
  

//   const permissions = useMemo(() => {
//     return roles.flatMap((role) => role.permissions ?? []);
//   }, [roles]);

//   // اگه user لود نشده
//   if (!user) return false;
  
//   // اگه نقشش "admin" هست (سوپر ادمین)
//   const isSuperAdmin = roles.some((role) => role.name === "admin");
//   if (isSuperAdmin) return true;

//   // اگه permission مشخصی درخواست نشده
//   if (
//     !permission ||
//     permission === "" ||
//     (Array.isArray(permission) && permission.length === 0)
//   ) {
//     return false;
//   }


//   // اگه آرایه باشه
//   if (Array.isArray(permission)) {
//     console.log(permission);
    
//     return permission.some((perm) =>
//       permissions.some((p) => p.name === perm)
//     );
//   }

//   return permissions.some((p) => p.name === permission);
// };


import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useHasPermission = (permission) => {
  const user = useSelector((state) => state.user.user);
  
  const roles = useMemo(() => user?.roles ?? [], [user]);

  const userPermissions = useMemo(() => {
    return roles.flatMap((role) => role.permissions ?? []).map(p => p?.name?.trim());
  }, [roles]);

  if (!user) return false;

  // بررسی نقش سوپر ادمین
  const isSuperAdmin = roles.some((role) => role.name === "admin");
  if (isSuperAdmin) return true;

  if (
    !permission ||
    permission === "" ||
    (Array.isArray(permission) && permission.length === 0)
  ) {
    return false;
  }

  if (Array.isArray(permission)) {
    return permission.some((perm) => userPermissions.includes(perm?.trim()));
  }

  return userPermissions.includes(permission?.trim());
};