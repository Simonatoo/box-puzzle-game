const CELL_SIZE = 12
const CELL_TYPE = {
    ground: 0,
    wall: 1,
    box: 2,
    goal: 3,
    spawnPoint: 9
}

let offsetX = 0
let offsetY = 0
let cellData: Sprite[][] = []
let spawnGridPos: IPosition
let spawnPixelPos: IPosition
let goalPositions: IPosition[] = []
let currentMap: IMap

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

const validateMap = (map: IMap): boolean => {
    const width = map[0].length
    for (let r = 0; r < map.length; r++) {
        if (map[r].length !== width) {
            return false
        }
    }
    for (let c = 0; c < width; c++) {
        if (map[0][c] !== CELL_TYPE.wall || map[map.length - 1][c] !== CELL_TYPE.wall) {
            return false
        }
    }
    for (let r = 0; r < map.length; r++) {
        if (map[r][0] !== CELL_TYPE.wall || map[r][width - 1] !== CELL_TYPE.wall) {
            return false
        }
    }
    return true
}