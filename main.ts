let levelIndex = 0
let gameStarted = false

const startLevel = (index: number) => {
    clearLevel()
    generateMap(LEVELS[index])
    spawnPlayer()
}

onLevelWin = () => {
    if (levelIndex < LEVELS.length - 1) {
        game.splash("Fase completa!", "Proxima fase...")
        levelIndex += 1
        startLevel(levelIndex)
    } else {
        game.splash("Parabens!", "Voce completou todas as fases!")
    }
}

const menuText = textsprite.create("Press A to start")
menuText.setPosition(screen.width/2, screen.height - 20)

controller.A.onEvent(ControllerButtonEvent.Released, () => {
    gameStarted = true
    menuText.destroy()
    startLevel(levelIndex)
})
