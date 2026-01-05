import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

const PORT = 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", socket => {
    console.log("🟢 Cliente conectado");
});

httpServer.listen(PORT, () => {
    console.log(`🔥 Servidor listo en http://localhost:${PORT}`);
});