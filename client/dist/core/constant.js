export const CONST = {
    PACMAN_SPEED: 32,
    TILE_SIZE: 32,
    PACMAN_START_ROW: 1,
    PACMAN_START_COL: 1,
    PACMAN_SIZE: 12,
    PACMAN_COLLIDE: 24,
};
export var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["RIGHT"] = "right";
    Direction["LEFT"] = "left";
})(Direction || (Direction = {}));
