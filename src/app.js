import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//socket settings

server.listen(3000, () => {
  console.log(`Server is listening on 3000`);
});

io.on("connection", (socket) => {
  console.log(`User connected`);

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import followRouter from "./routes/follow.routes.js";
import shareRouter from "./routes/share.routes.js";
import likeRouter from "./routes/like.routes.js";
import storieRouter from "./routes/storie.routes.js";
import commentRouter from "./routes/comment.routes.js";

//routes decleration  http://localhost:8080/api/v1/users
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/shares", shareRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/stories", storieRouter);
app.use("/api/v1/comments", commentRouter);
//
export { app };
