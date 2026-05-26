// User roles
export type UserRole = "parent" | "admin";

// Device status
export type DeviceStatus = "inactive" | "active" | "deactivated";

// Snapshot type
export type SnapshotType = "left_desk" | "bad_posture" | "manual";

// Monitoring session status
export type MonitoringStatus = "active" | "stopped";

// Study session status
export type StudySessionStatus = "studying" | "break" | "completed";

// User
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

// Child
export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}

// Device
export interface Device {
  id: string;
  serialNumber: string;
  activationCode: string;
  model: string;
  firmwareVersion: string;
  status: DeviceStatus;
}

// Monitoring Session
export interface MonitoringSession {
  id: string;
  childId: string;
  deviceId: string;
  status: MonitoringStatus;
  startedAt: string;
  stoppedAt?: string;
}

// Snapshot
export interface Snapshot {
  id: string;
  type: SnapshotType;
  imageUrl: string;
  description?: string;
  timestamp: string;
}

// Pomodoro Config
export interface PomodoroConfig {
  studyDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

// Study Session
export interface StudySession {
  id: string;
  status: StudySessionStatus;
  cycleNumber: number;
  startedAt: string;
  endedAt?: string;
}

// Auth responses
export interface LoginResponse {
  accessToken: string;
  user: User;
}

// API error format
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
