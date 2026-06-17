/**
 * Mock API server for FE-Onbi monitoring UI testing.
 * 
 * HTTP REST + Socket.IO WebSocket (real-time alerts & device status).
 * 
 * Install: npm install socket.io --no-save (1-time)
 * 
 * Usage:
 *   1. node mock-server.js
 *   2. Update .env.local: NEXT_PUBLIC_API_URL=http://localhost:3005
 *   3. Restart: npm run dev
 */

const http = require('http');
const { Server: SocketIOServer } = require('socket.io');

const PORT = 3005;

// ========== MOCK DATA ==========

const now = Date.now();

const mockCurrentSession = { id: 42, childId: 1, startTime: new Date(now - 47 * 60000).toISOString(), status: 'active' };

const mockHistory = [
  { id: 40, childId: 1, startTime: new Date(now - 2 * 3600000).toISOString(), endTime: new Date(now - 1.5 * 3600000).toISOString(), status: 'completed' },
  { id: 38, childId: 1, startTime: new Date(now - 5 * 3600000).toISOString(), endTime: new Date(now - 4.2 * 3600000).toISOString(), status: 'completed' },
  { id: 35, childId: 1, startTime: new Date(now - 24 * 3600000).toISOString(), endTime: new Date(now - 23.5 * 3600000).toISOString(), status: 'completed' },
  { id: 30, childId: 1, startTime: new Date(now - 48 * 3600000).toISOString(), endTime: new Date(now - 47.3 * 3600000).toISOString(), status: 'completed' },
];

const mockPomodoroConfig = { studyDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, cyclesBeforeLongBreak: 4 };

const mockStudySessions = [
  { id: 1, startTime: new Date(now - 1 * 3600000).toISOString(), endTime: new Date(now - 0.5 * 3600000).toISOString(), duration: 25, subject: 'Toán' },
  { id: 2, startTime: new Date(now - 2 * 3600000).toISOString(), endTime: new Date(now - 1.55 * 3600000).toISOString(), duration: 25, subject: 'Văn' },
  { id: 3, startTime: new Date(now - 4 * 3600000).toISOString(), endTime: new Date(now - 3.55 * 3600000).toISOString(), duration: 25, subject: 'Tiếng Anh' },
  { id: 4, startTime: new Date(now - 26 * 3600000).toISOString(), endTime: new Date(now - 25.55 * 3600000).toISOString(), duration: 25, subject: 'Toán' },
  { id: 5, startTime: new Date(now - 27 * 3600000).toISOString(), endTime: new Date(now - 26.55 * 3600000).toISOString(), duration: 25, subject: 'Lý' },
];

const mockSnapshots = [
  { id: 101, type: 'left_desk', imageUrl: 'https://picsum.photos/seed/snap1/640/480', description: 'Bé rời bàn lúc 14:23', createdAt: new Date(now - 600000).toISOString(), sessionId: 42 },
  { id: 102, type: 'bad_posture', imageUrl: 'https://picsum.photos/seed/snap2/640/480', description: 'Tư thế không đúng, cúi sát bàn', createdAt: new Date(now - 1200000).toISOString(), sessionId: 42 },
  { id: 103, type: 'manual', imageUrl: 'https://picsum.photos/seed/snap3/640/480', description: 'Phụ huynh chụp', createdAt: new Date(now - 1800000).toISOString(), sessionId: 42 },
  { id: 104, type: 'left_desk', imageUrl: 'https://picsum.photos/seed/snap4/640/480', description: 'Rời bàn trong giờ học', createdAt: new Date(now - 3600000).toISOString(), sessionId: 40 },
  { id: 105, type: 'bad_posture', imageUrl: 'https://picsum.photos/seed/snap5/640/480', description: 'Nằm xuống bàn', createdAt: new Date(now - 7200000).toISOString(), sessionId: 40 },
  { id: 106, type: 'left_desk', imageUrl: 'https://picsum.photos/seed/snap6/640/480', description: 'Rời khỏi bàn học', createdAt: new Date(now - 14400000).toISOString(), sessionId: 38 },
  { id: 107, type: 'manual', imageUrl: 'https://picsum.photos/seed/snap7/640/480', description: 'Kiểm tra bài tập', createdAt: new Date(now - 86400000).toISOString(), sessionId: 35 },
  { id: 108, type: 'bad_posture', imageUrl: 'https://picsum.photos/seed/snap8/640/480', description: 'Mắt gần bàn', createdAt: new Date(now - 90000000).toISOString(), sessionId: 35 },
];

// ========== HELPERS ==========

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function cors(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end();
}

function matchPath(path, pattern) {
  const parts = path.split('/').filter(Boolean);
  const pats = pattern.split('/').filter(Boolean);
  if (parts.length !== pats.length) return false;
  for (let i = 0; i < parts.length; i++) {
    if (pats[i] === '*') continue;
    if (pats[i] !== parts[i]) return false;
  }
  return true;
}

// ========== ROUTES ==========

// Generate a JWT-like accessToken with base64 payload that frontend can decode
function makeAccessToken(role = 'parent', userId = 1) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: userId, role, email: role === 'admin' ? 'admin@test.com' : 'parent@test.com', iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  return `${header}.${payload}.mock_signature`;
}

const ROUTES = [
  // Auth
  { method: 'POST', pattern: '/auth/login', handler: () => ({ accessToken: makeAccessToken('parent'), user: { id: 1, email: 'parent@test.com', role: 'parent' } }) },
  { method: 'POST', pattern: '/auth/register', handler: () => ({ accessToken: makeAccessToken('parent') }) },
  { method: 'POST', pattern: '/auth/forgot-password', handler: () => ({ success: true }) },
  { method: 'POST', pattern: '/auth/verify-otp', handler: () => ({ accessToken: makeAccessToken('parent') }) },
  { method: 'POST', pattern: '/auth/reset-password', handler: () => ({ success: true }) },

  // Parents
  { method: 'GET', pattern: '/parents/profile', handler: () => ({ id: 1, name: 'Nguyễn Văn A', email: 'parent@test.com', phone: '0901234567' }) },
  { method: 'PATCH', pattern: '/parents/profile', handler: () => ({ success: true }) },
  { method: 'PATCH', pattern: '/parents/avatar', handler: () => ({ avatarUrl: '/uploads/avatar.jpg' }) },
  { method: 'POST', pattern: '/parents/change-password', handler: () => ({ success: true }) },

  // Children
  { method: 'GET', pattern: '/children', handler: () => ([
    { id: 1, name: 'Bé An', dateOfBirth: '2018-05-12', gender: 'male' },
    { id: 2, name: 'Bé Bình', dateOfBirth: '2020-08-20', gender: 'female' },
  ])},
  { method: 'POST', pattern: '/children', handler: () => ({ id: 3, name: 'Bé Mới' }) },
  { method: 'GET', pattern: '/children/1', handler: () => ({ id: 1, name: 'Bé An', dateOfBirth: '2018-05-12T00:00:00.000Z', gender: 'male' }) },
  { method: 'PATCH', pattern: '/children/1', handler: () => ({ success: true }) },
  { method: 'DELETE', pattern: '/children/1', handler: () => ({ success: true }) },

  // Monitoring - wildcard * matches any childId
  { method: 'POST', pattern: '/children/*/monitoring/start', handler: () => (mockCurrentSession) },
  { method: 'POST', pattern: '/children/*/monitoring/stop', handler: () => ({ success: true }) },
  { method: 'GET', pattern: '/children/*/monitoring/current', handler: () => (mockCurrentSession) },
  { method: 'GET', pattern: '/children/*/monitoring/history', handler: () => (mockHistory) },
  { method: 'GET', pattern: '/children/*/monitoring/pomodoro-config', handler: () => (mockPomodoroConfig) },
  { method: 'PATCH', pattern: '/children/*/monitoring/pomodoro-config', handler: () => ({ success: true }) },
  { method: 'GET', pattern: '/children/*/monitoring/study-sessions', handler: () => (mockStudySessions) },
  { method: 'GET', pattern: '/children/*/monitoring/snapshots', handler: (params, query) => {
    if (query && query.limit) return mockSnapshots.slice(0, Number(query.limit));
    return mockSnapshots;
  }},
  { method: 'GET', pattern: '/children/*/monitoring/stream-config', handler: () => ({ stunServers: ['stun:stun.l.google.com:19302'], turnServers: [] }) },

  // Devices
  { method: 'POST', pattern: '/devices/activate', handler: () => ({ id: 'device-001', code: 'ABC123', name: 'Camera bàn 01' }) },
  { method: 'POST', pattern: '/devices/assign', handler: () => ({ success: true }) },
  { method: 'POST', pattern: '/devices/unassign', handler: () => ({ success: true }) },

  // Admin
  { method: 'GET', pattern: '/admin/dashboard', handler: () => ({
    totalUsers: 15, totalDevices: 8, activeSessions: 3, alerts24h: 12,
    users: { total: 15, active: 10, newThisMonth: 3 },
    devices: { total: 8, online: 5, offline: 3 },
    sessions: { today: 7, avgDuration: '45 phút' },
  })},
  { method: 'GET', pattern: '/admin/users', handler: () => ([
    { id: 1, name: 'Nguyễn Văn A', email: 'a@test.com', role: 'parent', status: 'active', createdAt: '2025-01-15', childrenCount: 2 },
    { id: 2, name: 'Trần Thị B', email: 'b@test.com', role: 'parent', status: 'active', createdAt: '2025-02-20', childrenCount: 1 },
    { id: 3, name: 'Quản trị viên', email: 'admin@test.com', role: 'admin', status: 'active', createdAt: '2024-12-01', childrenCount: 0 },
  ])},
  { method: 'POST', pattern: '/admin/users', handler: () => ({ id: 99 }) },
  { method: 'GET', pattern: '/admin/users/1', handler: () => ({ id: 1, name: 'Nguyễn Văn A', email: 'a@test.com', role: 'parent', status: 'active', createdAt: '2025-01-15', phone: '0901234567', childrenCount: 2 }) },
  { method: 'DELETE', pattern: '/admin/users/*', handler: () => ({ success: true }) },
  { method: 'GET', pattern: '/admin/devices/stats', handler: () => ({ total: 8, online: 5, offline: 3, sessionsToday: 7 }) },
  { method: 'GET', pattern: '/admin/devices', handler: () => ([
    { id: 'dev-001', name: 'Camera bàn 01', status: 'online', childName: 'Bé An', lastActive: new Date().toISOString() },
    { id: 'dev-002', name: 'Camera bàn 02', status: 'online', childName: 'Bé Bình', lastActive: new Date().toISOString() },
    { id: 'dev-003', name: 'Camera bàn 03', status: 'offline', childName: null, lastActive: new Date(now - 86400000).toISOString() },
  ])},
  { method: 'POST', pattern: '/admin/devices', handler: () => ({ id: 'dev-099' }) },
  { method: 'GET', pattern: '/admin/devices/dev-001', handler: () => ({ id: 'dev-001', name: 'Camera bàn 01', code: 'ABC123', status: 'online', childId: 1, childName: 'Bé An', lastActive: new Date().toISOString(), createdAt: '2025-03-10' }) },
  { method: 'PATCH', pattern: '/admin/devices/*/deactivate', handler: () => ({ success: true }) },
  { method: 'PATCH', pattern: '/admin/devices/*/reactivate', handler: () => ({ success: true }) },
  { method: 'GET', pattern: '/admin/monitoring-sessions', handler: () => (mockHistory) },
];

// ========== SERVER ==========
// Create server WITHOUT callback — Socket.IO must register its listener first
const server = http.createServer();

// ========== SOCKET.IO (WebSocket) — MUST be before HTTP handler ==========

const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

// Then add HTTP request handler (skips /socket.io/ handled by Socket.IO)
server.on('request', (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const method = req.method.toUpperCase();
  const path = url.pathname;
  const query = Object.fromEntries(url.searchParams);

  // Let Socket.IO handle /socket.io/ requests
  if (path.startsWith('/socket.io')) return;

  if (method === 'OPTIONS') return cors(res);

  let matchedHandler = null;
  let routePath = null;
  for (const route of ROUTES) {
    if (route.method === method && matchPath(path, route.pattern)) {
      matchedHandler = route.handler;
      routePath = route.pattern;
      break;
    }
  }

  if (!matchedHandler) {
    console.log(`  [404] ${method} ${path}`);
    return json(res, { error: 'Mock: endpoint not implemented', path }, 404);
  }

  console.log(`  [200] ${method} ${path} -> ${routePath}`);

  if (['POST', 'PATCH', 'DELETE'].includes(method)) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch {}
      const result = matchedHandler(parsed, query);
      json(res, result, method === 'POST' && !result.id ? 201 : 200);
    });
  } else {
    const result = matchedHandler(null, query);
    json(res, result);
  }
});

io.of('/monitoring').on('connection', (socket) => {
  console.log('  [WS] Client connected');

  socket.on('join-room', (data) => {
    const childId = data?.childId || '1';
    console.log(`  [WS] Joined room: ${childId}`);
    socket.join(`child:${childId}`);
  });

  socket.on('leave-room', (data) => {
    const childId = data?.childId || '1';
    console.log(`  [WS] Left room: ${childId}`);
    socket.leave(`child:${childId}`);
  });

  socket.on('disconnect', () => {
    console.log('  [WS] Client disconnected');
  });
});

// Send periodic mock alerts to connected rooms
setInterval(() => {
  const types = ['left_desk', 'bad_posture', 'manual'];
  const type = types[Math.floor(Math.random() * types.length)];
  const descs = {
    left_desk: 'Bé rời bàn trong 30 giây',
    bad_posture: 'Phát hiện tư thế không đúng',
    manual: 'Chụp định kỳ từ camera',
  };
  const alert = {
    type,
    description: `${descs[type]} - ${new Date().toLocaleTimeString()}`,
    imageUrl: `https://picsum.photos/seed/ws${Date.now()}/400/300`,
    timestamp: new Date().toISOString(),
  };
  io.of('/monitoring').emit('alert', alert);
}, 30000);

// Send periodic device status
setInterval(() => {
  io.of('/monitoring').emit('device-status', { online: true });
}, 15000);

server.listen(PORT, () => {
  console.log(`\n== Mock API Server running on http://localhost:${PORT} ==\n`);
  console.log('To use:');
  console.log('  1. Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:3005');
  console.log('  2. Restart: npm run dev');
  console.log(`  3. Open http://localhost:3001/parent/monitoring/1`);
  console.log('');
});
