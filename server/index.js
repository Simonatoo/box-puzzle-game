if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const { WebSocketServer } = require("ws")
const { MongoClient } = require("mongodb")

const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI
const LEADERBOARD_LIMIT = 10

const client = new MongoClient(MONGODB_URI)
let scoresCollection

async function start() {
    await client.connect()
    scoresCollection = client.db("box-puzzle-game").collection("scores")

    const wss = new WebSocketServer({ port: PORT })
    console.log(`WebSocket server listening on port ${PORT}`)

    wss.on("connection", (socket, req) => {
        console.log(`client connected from ${req.socket.remoteAddress}`)
        socket.on("message", (raw) => handleMessage(socket, raw))
        socket.on("close", () => console.log("client disconnected"))
        socket.on("error", (err) => console.error("socket error:", err))
    })
}

async function handleMessage(socket, raw) {
    console.log("received:", raw.toString())
    let msg
    try {
        msg = JSON.parse(raw.toString())
    } catch {
        return socket.send(JSON.stringify({ action: "error", message: "invalid JSON" }))
    }

    if (msg.action === "saveScore") {
        await scoresCollection.insertOne({
            name: String(msg.name).slice(0, 20),
            score: Number(msg.score) || 0,
            createdAt: new Date()
        })
        console.log(`saved score: ${msg.name} - ${msg.score}`)
        socket.send(JSON.stringify({ action: "saveScore", status: "ok" }))
    } else if (msg.action === "getLeaderboard") {
        const data = await scoresCollection
            .find({})
            .sort({ score: -1 })
            .limit(LEADERBOARD_LIMIT)
            .project({ _id: 0, name: 1, score: 1 })
            .toArray()
        socket.send(JSON.stringify({ action: "leaderboard", data }))
    } else {
        socket.send(JSON.stringify({ action: "error", message: "unknown action" }))
    }
}

start().catch((err) => {
    console.error("Failed to start server:", err)
    process.exit(1)
})
