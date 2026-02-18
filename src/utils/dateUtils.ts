import { format, parse, isToday as isTodayFn, startOfWeek, addDays } from 'date-fns';
import { DATE_FORMAT } from '../config/constants';

/**
 * Format a Date object to DD-MM-YYYY string
 */
export const formatDate = (date: Date): string => {
    return format(date, 'dd-MM-yyyy');
};

/**
 * Parse a DD-MM-YYYY string to Date object
 */
export const parseDate = (dateString: string): Date => {
    return parse(dateString, 'dd-MM-yyyy', new Date());
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
    return isTodayFn(date);
};

/**
 * Get array of dates for the current week (Sunday to Saturday)
 */
export const getWeekDates = (date: Date): Date[] => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

/**
 * Format time based on device preference
 */
export const formatTime = (date: Date, use24Hour: boolean = false): string => {
    return format(date, use24Hour ? 'HH:mm' : 'hh:mm a');
};

/**
 * Get month name from date
 */
export const getMonthName = (date: Date): string => {
    return format(date, 'MMMM yyyy');
};

/**
 * Get day name from date
 */
export const getDayName = (date: Date): string => {
    return format(date, 'EEEE');
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return formatDate(date1) === formatDate(date2);
};
