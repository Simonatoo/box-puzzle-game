let currentCell: IPosition
let target: Sprite
let isMoving = false

let moveset = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
}

const spawnPlayer = () => {
    player = sprites.create(playerImage, SpriteKind.Player);
    currentCell = { x: spawnGridPos.x, y: spawnGridPos.y }
    player.setPosition(spawnPixelPos.x, spawnPixelPos.y)
    player.z = 2
}

const playerMovement = () => {
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
}