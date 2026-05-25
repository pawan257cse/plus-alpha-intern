import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface SocketUser {
  id: string;
  role: string;
}

export const initSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as SocketUser;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.user?.id;
    if (userId) socket.join(`user:${userId}`);

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("send_message", (data: { conversationId: string; content: string }) => {
      io.to(`conversation:${data.conversationId}`).emit("new_message", {
        sender: userId,
        content: data.content,
        createdAt: new Date(),
      });
    });

    socket.on("typing", (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", userId);
    });
  });

  return io;
};
