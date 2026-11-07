// components/Modal/modal.js

export const modalListeners = [];

let modalId = 0;

const defaultIcons = {
  warning: "danger-triangle",
  danger: "danger-circle",
  success: "check-circle",
  info: "info-circle",
};

export const openConfirmModal = (options = {}) => {
  return new Promise((resolve) => {
    const id = ++modalId;

    const modal = {
      id,
      type: "confirm",

      title: options.title || "تأیید عملیات",
      message: options.message || "",

      confirmText: options.confirmText || "تأیید",
      cancelText: options.cancelText || "لغو",

      variant: options.variant || "warning",

      icon: options.icon || defaultIcons[options.variant || "warning"],

      styles: options.styles || {},

      closeOnBackdrop: options.closeOnBackdrop ?? true,

      resolve,
    };

    modalListeners.forEach((listener) => listener(modal));
  });
};

export const openAlertModal = (options = {}) => {
  return new Promise((resolve) => {
    const id = ++modalId;

    const modal = {
      id,
      type: "alert",

      title: options.title || "اطلاعیه",
      message: options.message || "",

      confirmText: options.confirmText || "باشه",

      variant: options.variant || "info",

      icon: options.icon || defaultIcons[options.variant || "info"],

      styles: options.styles || {},

      closeOnBackdrop: options.closeOnBackdrop ?? true,

      resolve,
    };

    modalListeners.forEach((listener) => listener(modal));
  });
};
