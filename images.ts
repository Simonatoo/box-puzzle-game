// images.ts

namespace SpriteKind {
    export const Ground = SpriteKind.create();
    export const Wall = SpriteKind.create();
    export const Box = SpriteKind.create();
    export const Goal = SpriteKind.create();
}

const playerImage = img`
    7 7 7 7 7 7 7 7 7 7 7 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f 1 f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f f f f f f f 7
    7 f f f f 1 1 1 1 1 1 7
    7 7 7 7 7 7 7 7 7 7 7 7
`;

const boxImage = img`
    1 1 1 1 1 1 1 1 1 1 1 1
    1 1 f f f f f f f f 1 1
    1 f 1 f f f f f f 1 f 1
    1 f f 1 f f f f 1 f f 1
    1 f f f 1 f f 1 f f f 1
    1 f f f f 1 1 f f f f 1
    1 f f f f 1 1 f f f f 1
    1 f f f 1 f f 1 f f f 1
    1 f f 1 f f f f 1 f f 1
    1 f 1 f f f f f f 1 f 1
    1 1 f f f f f f f f 1 1
    1 1 1 1 1 1 1 1 1 1 1 1
`;

const groundImage = img`
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
    f f f f f f f f f f f f
`;

const wallImage = img`
    1 1 1 1 1 1 1 1 1 1 1 1
    1 f 1 f 1 f 1 f 1 f f 1
    1 f 1 f 1 f 1 f 1 1 f 1
    1 f 1 f 1 f 1 f f f f 1
    1 1 1 f 1 f 1 f 1 1 f 1
    1 f f f 1 f 1 f 1 f f 1
    1 1 1 f 1 f 1 f 1 1 f 1
    1 f 1 f 1 f f f f 1 f 1
    1 f 1 f 1 f 1 f f 1 f 1
    1 f 1 f 1 f 1 f 1 1 f 1
    1 f 1 f f f 1 f f f f 1
    1 1 1 1 1 1 1 1 1 1 1 1
`;

const goalImage = img`
    . . . . 7 7 7 7 . . . .
    . . 7 7 . . . . 7 7 . .
    . 7 . . . . . . . . 7 .
    . 7 . . . . . . . . 7 .
    7 . . . . . . . . . . 7
    7 . . . . . . . . . . 7
    7 . . . . . . . . . . 7
    7 . . . . . . . . . . 7
    . 7 . . . . . . . . 7 .
    . 7 . . . . . . . . 7 .
    . . 7 7 . . . . 7 7 . .
    . . . . 7 7 7 7 . . . .
`;
