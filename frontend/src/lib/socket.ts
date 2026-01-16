// Socket.io client for real-time updates
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
  }
  return socket;
}

export function subscribeToScoreUpdates(cb: (data: { leadId: string; newScore: number }) => void) {
  getSocket().on('scoreUpdate', cb);
}

export function unsubscribeFromScoreUpdates(cb: (data: { leadId: string; newScore: number }) => void) {
  getSocket().off('scoreUpdate', cb);
}
