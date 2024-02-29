import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://145.239.87.85';
//const URL = 'http://10.0.2.2:3000';
export const socket = io(URL, {transports: ['websocket']});