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

const sendScore = (name: string, score: number): void => {
    const ws = getSocket()
    whenOpen(ws, () => {
        ws.send(JSON.stringify({ action: "saveScore", name: name, score: score }))
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
    const ws = getSocket()
    ws.onmessage = (evt: MessageEvent) => {
        const msg = JSON.parse(evt.data as string)
        if (msg.action === "leaderboard") {
            renderLeaderboard(msg.data)
        }
    }
    whenOpen(ws, () => {
        ws.send(JSON.stringify({ action: "getLeaderboard" }))
    })
}
