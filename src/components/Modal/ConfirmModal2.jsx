import { useEffect, useState } from "react";

const ANIMATION_DURATION = 250;

const variantStyles = {
    warning: {
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        button:
            "bg-yellow-500 hover:bg-yellow-600",
    },

    danger: {
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        button:
            "bg-red-500 hover:bg-red-600",
    },

    success: {
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        button:
            "bg-green-500 hover:bg-green-600",
    },

    info: {
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        button:
            "bg-blue-500 hover:bg-blue-600",
    },
};

const ConfirmModal2 = ({
    modal,
    onClose,
}) => {

    const [mounted, setMounted] =
        useState(false);

    const [leaving, setLeaving] =
        useState(false);

    const currentVariant = {
        ...(variantStyles[
            modal.variant
        ] || variantStyles.info),

        ...modal.styles,
    };

    useEffect(() => {

        setMounted(true);

    }, []);

    useEffect(() => {

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {

                handleClose(false);

            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, []);

    const handleClose = (result) => {

        if (leaving) return;

        setLeaving(true);

        setTimeout(() => {

            onClose(result);

        }, ANIMATION_DURATION);

    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

            <div
                onClick={() => {

                    if (
                        modal.closeOnBackdrop
                    ) {

                        handleClose(false);

                    }

                }}
                className={`
                    absolute inset-0 bg-black/30 backdrop-blur-[2px]
                    ${
                        leaving
                            ? "backdrop-out"
                            : "backdrop-in"
                    }
                `}
            />

            <div
                className={`
                    relative w-full max-w-md rounded-2xl
                    bg-white shadow-2xl overflow-hidden
                    will-change-transform
                    ${
                        leaving
                            ? "slide-out"
                            : "slide-in"
                    }
                `}
            >

                <div className="flex items-center gap-3 p-5 border-b border-gray-100">

                    <div
                        className={`
                            w-12 h-12 rounded-xl
                            flex items-center justify-center
                            ${currentVariant.iconBg}
                        `}
                    >

                        <svg
                            className={`
                                w-[22px]
                                h-[22px]
                                ${currentVariant.iconColor}
                                fill-transparent
                            `}
                        >
                            <use
                                xlinkHref={`#icon-${modal.icon}`}
                            />
                        </svg>

                    </div>

                    <div className="flex-1">

                        <h2 className="text-lg font-bold text-gray-800">
                            {modal.title}
                        </h2>

                    </div>

                    <button
                        onClick={() =>
                            handleClose(false)
                        }
                        className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            bg-gray-100
                            hover:bg-gray-200
                            transition
                            cursor-pointer
                        "
                    >
                        <i className="fa-regular fa-xmark" />
                    </button>

                </div>

                <div className="p-5">

                    <p className="text-sm leading-7 text-gray-600">
                        {modal.message}
                    </p>

                </div>

                <div className="flex gap-3 p-5 pt-0">

                    {
                        modal.type ===
                        "confirm" && (
                            <button
                                onClick={() =>
                                    handleClose(
                                        false
                                    )
                                }
                                className="
                                    flex-1 py-3 rounded-xl
                                    border border-gray-200
                                    hover:bg-gray-100
                                    transition
                                    cursor-pointer
                                "
                            >
                                {
                                    modal.cancelText
                                }
                            </button>
                        )
                    }

                    <button
                        onClick={() =>
                            handleClose(true)
                        }
                        className={`
                            flex-1 py-3 rounded-xl
                            text-white transition
                            cursor-pointer
                            ${currentVariant.button}
                        `}
                    >
                        {modal.confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ConfirmModal2;