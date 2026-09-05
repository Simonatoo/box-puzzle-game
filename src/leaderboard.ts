const sendScore = (name: string, score: number): void => {
    const json = JSON.stringify({ action: "saveScore", name: name, score: score })
    control.simmessages.send("game-data", Buffer.fromUTF8(json), true)
}
