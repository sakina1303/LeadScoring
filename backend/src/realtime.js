// Socket.io real-time server for lead scoring updates

import { Server } from 'socket.io';
import http from 'http';

let io;
let server;

export function createRealtimeServer(app) {
  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  return server;
}

export function emitScoreUpdate(leadId, newScore) {
  if (io) io.emit('scoreUpdate', { leadId, newScore });
}
