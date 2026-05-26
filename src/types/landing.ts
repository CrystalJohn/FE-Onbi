export type RobotMood = 'happy' | 'focus' | 'rest' | 'listening' | 'sleep' | 'alert';

export interface LEDStatus {
  focusMode: boolean;
  restMode: boolean;
  postureReminder: 'good' | 'warning' | 'critical';
  parentNotification: 'connected' | 'notifying' | 'offline';
}

export interface MVPFeature {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
  badge: string;
}

export interface TechSpec {
  name: string;
  value: string;
  details: string;
}
