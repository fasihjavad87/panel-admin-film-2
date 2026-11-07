// enums/userStatus.js

export const UserStatus = {
  ACTIVE: "active",
  BANNED: "banned",
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
};

export const UserStatusOptions = [
  {
    id: UserStatus.ACTIVE,
    title: "فعال",
    description: "کاربر فعال است",
  },
  {
    id: UserStatus.BANNED,
    title: "مسدود شده",
    description: "کاربر مسدود شده است",
  },
  {
    id: UserStatus.VERIFIED,
    title: "تایید شده",
    description: "کاربر تایید شده است",
  },
  {
    id: UserStatus.UNVERIFIED,
    title: "تایید نشده",
    description: "کاربر تایید نشده است",
  },
];
