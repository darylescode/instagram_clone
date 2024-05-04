import socketIO, { Socket } from "socket.io-client";
import { MessageType } from "../interfaces/types";
import socketConfig from "config/socketConfig";

class SocketService {
  private socket: Socket;

  constructor(url: string) {
    this.socket = socketIO(url, socketConfig);
  };

  addUserId(userId: any) {
    this.socket.emit("add-user", userId);
  };

  sendMessage(message: MessageType) {
    this.socket.emit("send-message", message);
  };

  onMessageReceived(callback: (message: MessageType) => void) {
    this.socket.on("get-message", callback);
  };

  onConnection() {
    console.log("Server socket connecting...");
    this.socket.on("connect", () => console.log("Server socket connected"));
  };

  onDisconnect() {
    this.socket.on("disconnect", () => console.log("Server socket disconnected"));
  };
};

export default SocketService;
