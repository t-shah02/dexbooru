import { io } from 'socket.io-client';

//const CHAT_SERVER_URL = process.env.LIVE_EVENTS_SERVER_URL || '';
const chatSocket = io('http://localhost:9000', {
	withCredentials: true
});

export default chatSocket;
