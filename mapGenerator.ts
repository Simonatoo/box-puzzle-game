const CELL_SIZE = 12
const CELL_TYPE = {
    ground: 0,
    wall: 1,
    box: 2,
    goal: 3,
    spawnPoint: 9
}

interface IPosition {
    x: number
    y: number
}

type IMap = number[][]

let offsetX = 0
let offsetY = 0
let cellData: Sprite[][] = []
let spawnGridPos: IPosition
let spawnPixelPos: IPosition
let goalPositions: IPosition[] = []
let currentMap: IMap
let levelComplete = false
let onLevelWin: () => void = () => { }

const validateMap = (map: IMap): boolean => {
    const width = map[0].length
    for (let r = 0; r < map.length; r++) {
        if (map[r].length !== width) {
            console.log("Mapa invalido: a linha " + r + " tem tamanho diferente das outras.")
            return false
        }
    }
    for (let c = 0; c < width; c++) {
        if (map[0][c] !== CELL_TYPE.wall || map[map.length - 1][c] !== CELL_TYPE.wall) {
            console.log("Mapa invalido: a borda de cima/baixo precisa ser toda parede.")
            return false
        }
    }
    for (let r = 0; r < map.length; r++) {
        if (map[r][0] !== CELL_TYPE.wall || map[r][width - 1] !== CELL_TYPE.wall) {
            console.log("Mapa invalido: a borda esquerda/direita precisa ser toda parede.")
            return false
        }
    }
    return true
}

const clearLevel = () => {
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

const generateMap = (map: IMap) => {
    validateMap(map)
    currentMap = map
    goalPositions = []

    const mapWidthPx = map[0].length * CELL_SIZE
    const mapHeightPx = map.length * CELL_SIZE
    offsetX = Math.floor((screen.width - mapWidthPx) / 2)
    offsetY = Math.floor((screen.height - mapHeightPx) / 2)

    for (let r = 0; r < map.length; r++) {
        cellData[r] = []
        for (let c = 0; c < map[r].length; c++) {
            const cell = map[r][c]
            let sprite: Sprite

            if (cell === CELL_TYPE.ground || cell === CELL_TYPE.spawnPoint) {
                sprite = sprites.create(groundImage, SpriteKind.Ground);
            } else if (cell === CELL_TYPE.wall) {
                sprite = sprites.create(wallImage, SpriteKind.Wall);
            } else if (cell === CELL_TYPE.box) {
                sprite = sprites.create(boxImage, SpriteKind.Box);
            } else if (cell === CELL_TYPE.goal) {
                sprite = sprites.create(goalImage, SpriteKind.Goal);
            }
            else {
                console.log("Sprite type doesnt exist.")
                continue
            }

            const posX = c * CELL_SIZE + (CELL_SIZE / 2) + offsetX
            const posY = r * CELL_SIZE + (CELL_SIZE / 2) + offsetY

            sprite.setPosition(posX, posY)

            if (cell === CELL_TYPE.spawnPoint) {
                spawnPixelPos = { x: posX, y: posY }
                spawnGridPos = { x: c, y: r }
            }

            if (cell === CELL_TYPE.goal) {
                goalPositions.push({ x: c, y: r })
            }

            cellData[r][c] = sprite
        }
    }
}

let moveset = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
}
let player: Sprite
let currentCell: IPosition
let target: Sprite
let isMoving = false

const spawnPlayer = () => {
    player = sprites.create(playerImage, SpriteKind.Player);
    currentCell = { x: spawnGridPos.x, y: spawnGridPos.y }
    player.setPosition(spawnPixelPos.x, spawnPixelPos.y)
    player.z = 2
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

game.onUpdate(() => {
    if (!gameStarted) return
    if (levelComplete) return

    if (!isMoving) {
        let dx = 0;
        let dy = 0;

        if (controller.up.isPressed()) {
            dx = moveset.up.dx;
            dy = moveset.up.dy;
        } else if (controller.down.isPressed()) {
            dx = moveset.down.dx;
            dy = moveset.down.dy;
        } else if (controller.left.isPressed()) {
            dx = moveset.left.dx;
            dy = moveset.left.dy;
        } else if (controller.right.isPressed()) {
            dx = moveset.right.dx;
            dy = moveset.right.dy;
        }

        if (dx !== 0 || dy !== 0) {
            let nextX = currentCell.x + dx;
            let nextY = currentCell.y + dy;
            let possibleTarget = cellData[nextY] ? cellData[nextY][nextX] : undefined;

            if (!possibleTarget) {
                return
            } else if (possibleTarget.kind() === SpriteKind.Box) {
                let boxNextX = nextX + dx;
                let boxNextY = nextY + dy;
                let spaceBehindBox = cellData[boxNextY] ? cellData[boxNextY][boxNextX] : undefined;

                if (spaceBehindBox && (spaceBehindBox.kind() === SpriteKind.Ground || spaceBehindBox.kind() === SpriteKind.Goal)) {

                    cellData[boxNextY][boxNextX] = possibleTarget;

                    let originalCellType = currentMap[nextY][nextX];
                    let newFloor: Sprite;

                    if (originalCellType === CELL_TYPE.goal) {
                        newFloor = sprites.create(goalImage, SpriteKind.Goal);
                    } else {
                        newFloor = sprites.create(groundImage, SpriteKind.Ground);
                    }

                    newFloor.setPosition(
                        nextX * CELL_SIZE + (CELL_SIZE / 2) + offsetX,
                        nextY * CELL_SIZE + (CELL_SIZE / 2) + offsetY
                    );
                    cellData[nextY][nextX] = newFloor;

                    possibleTarget.setPosition(
                        boxNextX * CELL_SIZE + (CELL_SIZE / 2) + offsetX,
                        boxNextY * CELL_SIZE + (CELL_SIZE / 2) + offsetY
                    );

                    spaceBehindBox.destroy();

                    target = newFloor;
                    currentCell = { x: nextX, y: nextY };
                    isMoving = true;
                }

            } else if (possibleTarget.kind() === SpriteKind.Ground || possibleTarget.kind() === SpriteKind.Goal) {
                target = possibleTarget;
                currentCell = { x: nextX, y: nextY };
                isMoving = true;
            }
        }

    } else {
        if (player.x < target.x) player.x += 1
        if (player.x > target.x) player.x -= 1
        if (player.y < target.y) player.y += 1
        if (player.y > target.y) player.y -= 1

        if (player.x === target.x && player.y === target.y) {
            isMoving = false

            if (checkLevelComplete()) {
                levelComplete = true
                onLevelWin()
            }
        }
    }
})