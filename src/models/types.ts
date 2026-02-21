import { Timestamp } from 'firebase/firestore';

export interface CategoryColors {
    event: string;
    note: string;
    todo: string;
    reminder: string;
}

// User model
export interface User {
    userId: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    theme: 'material' | 'glass';
    colorMode: 'light' | 'dark';
    primaryColor: string;
    categoryColors: CategoryColors;
    createdAt: Timestamp;
}

// Base calendar item
export interface CalendarItem {
    id: string;
    userId: string;
    date: string; // DD-MM-YYYY format
    type: 'event' | 'note' | 'todo' | 'reminder';
    source?: 'internal' | 'google' | 'outlook';
    payload: EventPayload | NotePayload | TodoPayload | ReminderPayload;
    createdAt: Timestamp;
    modifiedAt: Timestamp;
}

// Event payload
export interface EventPayload {
    title: string;
    description?: string;
    location?: string;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    allDay?: boolean;
    color?: string;
    meetLink?: string;
}

// Note payload
export interface NotePayload {
    title: string;
    content: string; // Rich text HTML
}

// Todo payload
export interface TodoPayload {
    title: string;
    description?: string;
    completed: boolean;
    priority?: 'low' | 'medium' | 'high';
    time?: string; // HH:mm format
}

// Reminder payload
export interface ReminderPayload {
    title: string;
    time: string; // HH:mm format
    notificationId?: string;
}

// Navigation types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export type MainTabParamList = {
    Calendar: undefined;
    Today: undefined;
    Settings: undefined;
};

export type MainStackParamList = {
    CalendarScreen: undefined;
    DateDetail: { date: string }; // DD-MM-YYYY
    CreateEvent: { date: string };
    CreateNote: { date: string };
    CreateTodo: { date: string };
    CreateReminder: { date: string };
    CalendarSync: undefined;
};
