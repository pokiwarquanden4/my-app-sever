export const socketId = {}

const socketService = (io) => {
    try {
        io.on("connection", (socket) => {
            console.log("Socket connected: " + socket.id)
            socketId[socket.handshake.auth.userId] = socket.id

            socket.on("disconnect", () => {
                console.log("Socket disconnected: " + socket.id)
                delete socketId[socket.handshake.auth.userId]
            });
        });
    } catch (err) {
        console.log(err);
    }
}

export default socketService