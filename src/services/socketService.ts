import { io, Socket } from 'socket.io-client';
// import {
//   updateSocketConnectFlag } from "@/redux/methods/SocketGeneralMethod";

class SocketService {
  private socket: Socket;

  constructor() {
    // "undefined" means the URL will be computed from the `window.location` object
    const URL = process.env.NEXT_PUBLIC_SOCKET_URL as any;
    this.socket = io(URL);

    // this.socket.on("connect", () => {
    //   // updateSocketConnectFlag({ socketIsConnected: true });
    //   console.log("connected");
    // });

    // this.socket.on('disconnect', () => {
    //   // updateSocketConnectFlag({ socketIsConnected: false });
    //   console.log("disconnected");
    // });
    
  }

  getSocket(): Socket {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket.connected;
  }
}

const socketService = new SocketService();
export default socketService;
