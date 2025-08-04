import { io } from "socket.io-client";

export const socket = io("http://35.215.219.1:80", {
  transports: ["websocket"], 
  path: "/socket.io",
});