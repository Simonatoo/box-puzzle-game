let levelIndex = 0
let gameStarted = false
let levelComplete = false
let score = 0
//let onLevelWin: () => void = () => { }

const startLevel = (index: number): void => {
    clearLevel()
    generateMap(LEVELS[index])
    spawnPlayer()
    info.showScore(true)
}

const clearLevel = (): void => {
    for (let r = 0; r < cellData.length; r++) {
        for (let c = 0; c < cellData[r].length; c++) {
            if (cellData[r][c]) cellData[r][c].destroy()
        }
    }
    cellData = []
    goalPositions = []
    if (player) player.destroy()
    isMoving = false
    levelComplete = false
}

const onLevelWin = (): void => {
    if (levelIndex < LEVELS.length - 1) {
        game.splash("Fase completa!", "Proxima fase...")
        levelIndex += 1
        startLevel(levelIndex)
    } else {
        const playerName = game.askForString("Digite seu nome:")
        sendScore(playerName, score)
        game.splash("Parabens, " + playerName + "!", score)
        game.gameOver(true)
    }
}

const checkLevelComplete = (): boolean => {
    if (goalPositions.length === 0) return false
    for (let i = 0; i < goalPositions.length; i++) {
        const pos = goalPositions[i]
        const occupant = cellData[pos.y][pos.x]
        if (!occupant || occupant.kind() !== SpriteKind.Box) {
            return false
        }
    }
    return true
}

game.onUpdateInterval(1000, () => {
    if (!gameStarted) return

    score++
    info.setScore(score)
})