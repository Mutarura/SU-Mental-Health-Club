import type { MonthlyAwareness } from '../types/database.types';

export const MONTHLY_AWARENESS: MonthlyAwareness[] = [
  {
    id: 'jan',
    month: 'January',
    theme: 'New Beginnings & Self-Compassion',
    message: 'Start gently. Progress over perfection.',
    icon: 'sun',
  },
  {
    id: 'feb',
    month: 'February',
    theme: 'Connection & Support',
    message: 'You’re not alone—reach out and connect.',
    icon: 'heart',
  },
  {
    id: 'mar',
    month: 'March',
    theme: 'Mindfulness & Presence',
    message: 'Pause, breathe, and be present.',
    icon: 'lightbulb',
  },
  {
    id: 'apr',
    month: 'April',
    theme: 'Stress Awareness',
    message: 'Notice stress early and care for yourself.',
    icon: 'balance',
  },
  {
    id: 'may',
    month: 'May',
    theme: 'Mental Health Awareness Month',
    message: 'Let’s talk openly about mental health.',
    icon: 'chat',
  },
  {
    id: 'jun',
    month: 'June',
    theme: 'Resilience & Growth',
    message: 'Small steps lead to big changes.',
    icon: 'people',
    resource_url: '/resources',
  },
];