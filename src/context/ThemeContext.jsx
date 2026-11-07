import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // دریافت تم ذخیره شده از localStorage یا پیش‌فرض 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        // بررسی سیستم اگر تم ذخیره شده نبود
        if (savedTheme) {
            return savedTheme;
        }
        // بررسی تم سیستم کاربر
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    // تابع تغییر تم
    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    // اعمال کلاس dark یا light به html
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook سفارشی برای استفاده راحت
// export const useTheme = () => {
//     const context = useContext(ThemeContext);
//     if (!context) {
//         throw new Error('useTheme must be used within ThemeProvider');
//     }
//     return context;
// };