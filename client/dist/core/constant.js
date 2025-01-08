export const CONST = {
    PACMAN_SPEED: 32,
    TILE_SIZE: 32,
    PACMAN_START_ROW: 1,
    PACMAN_START_COL: 1,
    PACMAN_SIZE: 28,
    PACMAN_COLLIDE: 24,
};
export var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["RIGHT"] = "right";
    Direction["LEFT"] = "left";
})(Direction || (Direction = {}));
export var MESSAGE_TYPE;
(function (MESSAGE_TYPE) {
    MESSAGE_TYPE["CREATE_MATCH"] = "CREATE_MATCH";
    MESSAGE_TYPE["SEND_MAP"] = "SEND_MAP";
    MESSAGE_TYPE["UPDATE_PACMAN_POSITION"] = "UPDATE_PACMAN_POSITION";
    MESSAGE_TYPE["REQUEST_FIND_PLAYERS_BY_NAME"] = "REQUEST_FIND_PLAYERS_BY_NAME";
})(MESSAGE_TYPE || (MESSAGE_TYPE = {}));
export var ACTION_TYPE;
(function (ACTION_TYPE) {
    ACTION_TYPE["GET"] = "GET";
    ACTION_TYPE["POST"] = "POST";
    ACTION_TYPE["PUT"] = "PUT";
    ACTION_TYPE["PATCH"] = "PATCH";
    ACTION_TYPE["DELETE"] = "DELETE";
})(ACTION_TYPE || (ACTION_TYPE = {}));
export const LOCAL_STORAGE_TYPE = {
    USER_ID: "USER_ID",
    USERNAME: "USERNAME",
    CURRENT_MAP: "CURRENT_MAP",
    CURRENT_ROOM_ID: "CURRENT_ROOM_ID",
};
