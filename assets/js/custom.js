/**
 * The Arcade simulator runs sandboxed and can't open real network connections,
 * so the game sends data one-way via control.simmessages.send("game-data", ...),
 * and this page (not sandboxed) relays it to the score server over WebSocket.
 *
 * There is currently no working path for the simulator to receive messages
 * back from this page, so this is fire-and-forget only.
 *
 * "disableTargetTemplateFiles": true is set in pxt.json so MakeCode won't
 * overwrite this file.
 */
document.addEventListener("DOMContentLoaded", function () {
    const SERVER_URL = "wss://box-puzzle-game.onrender.com"

    addSimMessageHandler("game-data", (msg) => {
        console.log("[game-data] received from game:", msg)
        const ws = new WebSocket(SERVER_URL)
        ws.onopen = () => {
            ws.send(JSON.stringify(msg))
            ws.close()
        }
        ws.onerror = (e) => {
            console.log("[game-data] websocket error", e)
        }
    })
})
