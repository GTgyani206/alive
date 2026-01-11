import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Generate a unique ID for sessions/uploads
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Format date for display
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Get or create session token from localStorage
export function getSessionToken(): string {
    if (typeof window === 'undefined') return '';

    let token = localStorage.getItem('avatar_session_token');
    if (!token) {
        token = generateId();
        localStorage.setItem('avatar_session_token', token);
    }
    return token;
}
