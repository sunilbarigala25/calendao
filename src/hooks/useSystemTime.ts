import { useState, useEffect } from 'react';

interface SystemTime {
    time: string;       // HH:mm format (24h)
    displayTime: string; // H:mm format for display
    ampm: string;       // AM/PM
    timezone: string;   // e.g., IST
    date: number;       // Day of month
    dayName: string;    // e.g., Thursday
    monthName: string;  // e.g., January
    fullDate: string;   // DD-MM-YYYY format
    year: number;       // Full year
}

function getFormattedTime(): SystemTime {
    // Always use a fresh Date() — no caching
    const now = new Date();

    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;

    const time = `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const displayTime = `${hours12}:${String(minutes).padStart(2, '0')}`;

    // Timezone abbreviation using Intl API (most reliable cross-platform)
    let timezone = 'Local';
    try {
        timezone = Intl.DateTimeFormat('en', { timeZoneName: 'short' })
            .formatToParts(now)
            .find(p => p.type === 'timeZoneName')?.value || 'Local';
    } catch (_) {
        // Fallback: compute UTC offset manually
        const offset = -now.getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const absH = Math.floor(Math.abs(offset) / 60);
        timezone = `UTC${sign}${absH}`;
    }

    const date = now.getDate();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();

    const dayFormatted = String(date).padStart(2, '0');
    const monthFormatted = String(now.getMonth() + 1).padStart(2, '0');
    const fullDate = `${dayFormatted}-${monthFormatted}-${year}`;

    return {
        time,
        displayTime,
        ampm,
        timezone,
        date,
        dayName,
        monthName,
        fullDate,
        year,
    };
}

export const useSystemTime = (): SystemTime => {
    const [systemTime, setSystemTime] = useState<SystemTime>(getFormattedTime());

    useEffect(() => {
        // Align to the next second boundary for precise flips
        const now = new Date();
        const msUntilNextSecond = 1000 - now.getMilliseconds();
        let intervalId: any;

        const timeoutId = setTimeout(() => {
            setSystemTime(getFormattedTime());
            // Then tick every second
            intervalId = setInterval(() => {
                setSystemTime(getFormattedTime());
            }, 1000);
        }, msUntilNextSecond);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return systemTime;
};
