const SERVER_URL = "wss://box-puzzle-game.onrender.com"

let socket: WebSocket
let leaderboardSprites: TextSprite[] = []

const getSocket = (): WebSocket => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(SERVER_URL)
    }
    return socket
}

const whenOpen = (ws: WebSocket, action: () => void): void => {
    if (ws.readyState === WebSocket.OPEN) {
        action()
    } else {
        ws.onopen = action
    }
}

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 5000

const withRetry = (action: () => void, retriesLeft: number = MAX_RETRIES): void => {
    const ws = getSocket()
    ws.onerror = () => {
        if (retriesLeft > 0) {
            pause(RETRY_DELAY_MS)
            socket = undefined
            withRetry(action, retriesLeft - 1)
        }
    }
    whenOpen(ws, action)
}

const sendScore = (name: string, score: number): void => {
    withRetry(() => {
        socket.send(JSON.stringify({ action: "saveScore", name: name, score: score }))
    })
}

const clearLeaderboard = (): void => {
    for (let i = 0; i < leaderboardSprites.length; i++) {
        leaderboardSprites[i].destroy()
    }
    leaderboardSprites = []
}

const renderLeaderboard = (entries: { name: string, score: number }[]): void => {
    clearLeaderboard()
    for (let i = 0; i < entries.length; i++) {
        const line = textsprite.create((i + 1) + ". " + entries[i].name + "  " + entries[i].score)
        line.setPosition(screen.width / 2, 16 + i * 14)
        leaderboardSprites.push(line)
    }
}

const showLeaderboard = (): void => {
    getSocket().onmessage = (evt: MessageEvent) => {
        const msg = JSON.parse(evt.data as string)
        if (msg.action === "leaderboard") {
            renderLeaderboard(msg.data)
        }
    }
    withRetry(() => {
        socket.send(JSON.stringify({ action: "getLeaderboard" }))
    })
}
