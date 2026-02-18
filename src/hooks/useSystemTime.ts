import { useState, useEffect } from 'react';

interface SystemTime {
    time: string; // HH:mm format
    ampm: string; // AM/PM
    timezone: string; // e.g., IST
    date: number; // Day of month
    dayName: string; // e.g., Thursday
    monthName: string; // e.g., January
    fullDate: string; // DD-MM-YYYY format
}

export const useSystemTime = (): SystemTime => {
    const [systemTime, setSystemTime] = useState<SystemTime>(getFormattedTime());

    function getFormattedTime(): SystemTime {
        const now = new Date();

        // Time in 12h format
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const [timePart, ampmPart] = timeStr.split(' ');

        // Timezone abbreviation (approximation for IST/Local)
        const timezone = Intl.DateTimeFormat('en-IN', { timeZoneName: 'short' })
            .formatToParts(now)
            .find(p => p.type === 'timeZoneName')?.value || 'IST';

        const date = now.getDate();
        const dayName = now.toLocaleDateString('en-IN', { weekday: 'long' });
        const monthName = now.toLocaleDateString('en-IN', { month: 'long' });

        // DD-MM-YYYY enforcement
        const dayFormatted = String(date).padStart(2, '0');
        const monthFormatted = String(now.getMonth() + 1).padStart(2, '0');
        const yearFormatted = now.getFullYear();
        const fullDate = `${dayFormatted}-${monthFormatted}-${yearFormatted}`;

        return {
            time: timePart,
            ampm: ampmPart || '',
            timezone,
            date,
            dayName,
            monthName,
            fullDate
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setSystemTime(getFormattedTime());
        }, 30000); // Update every 30 seconds for minute accuracy

        return () => clearInterval(timer);
    }, []);

    return systemTime;
};
