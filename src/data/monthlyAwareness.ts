export interface MonthlyAwareness {
  id: string;
  month: string;
  theme: string;
  message: string;
  caption: string;
  banner_url: string;
  icon: string;
  resource_url?: string;
}

export const MONTHLY_AWARENESS: MonthlyAwareness[] = [
  {
    id: 'oct',
    month: 'October',
    theme: 'Depression Awareness Month',
    message: 'Together, we can make a difference.',
    caption: 'Recognize signs and support one another.',
    banner_url: '/images/awareness/depression.jpg',
    icon: 'heart',
    resource_url: '/resources',
  },
  {
    id: 'nov',
    month: 'November',
    theme: 'Stress Management Month',
    message: 'Pause, breathe, and rebalance.',
    caption: 'Practical tools for everyday stress.',
    banner_url: '/images/awareness/stress.jpg',
    icon: 'balance',
  },
  {
    id: 'dec',
    month: 'December',
    theme: 'Mindfulness & Rest',
    message: 'Slow down. Be present. Restore.',
    caption: 'Mindful practices for holidays.',
    banner_url: '/images/awareness/mindfulness.jpg',
    icon: 'lightbulb',
  },
  {
    id: 'jan',
    month: 'January',
    theme: 'New Beginnings & Self-Compassion',
    message: 'Start gently. Progress over perfection.',
    caption: 'Build supportive habits that last.',
    banner_url: '/images/awareness/self-compassion.jpg',
    icon: 'sun',
  },
  {
    id: 'feb',
    month: 'February',
    theme: 'Connection & Support',
    message: 'You’re not alone—reach out and connect.',
    caption: 'Peer support strengthens us.',
    banner_url: '/images/awareness/connection.jpg',
    icon: 'people',
  },
  {
    id: 'mar',
    month: 'March',
    theme: 'Anxiety Awareness',
    message: 'Understanding reduces fear.',
    caption: 'Practical tips to manage anxiety.',
    banner_url: '/images/awareness/anxiety.jpg',
    icon: 'chat',
  },
];