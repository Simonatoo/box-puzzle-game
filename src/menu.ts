const menuText = textsprite.create("Press A to start")
menuText.setPosition(screen.width/2, screen.height - 20)

controller.A.onEvent(ControllerButtonEvent.Released, () => {
    gameStarted = true
    menuText.destroy()
    startLevel(levelIndex)
})