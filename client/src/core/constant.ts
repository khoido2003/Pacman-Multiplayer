export const CONST = {
  PACMAN_SPEED: 32,
  TILE_SIZE: 32,
  PACMAN_START_ROW: 1,
  PACMAN_START_COL: 1,
  PACMAN_SIZE: 28,
  PACMAN_COLLIDE: 24,
};

export enum Direction {
  UP = "up",
  DOWN = "down",
  RIGHT = "right",
  LEFT = "left",
}

export interface MapRead {
  tiles: number[][];
}

export enum MESSAGE_TYPE {
  CREATE_MATCH = "CREATE_MATCH",
  SEND_MAP = "SEND_MAP",
  UPDATE_PACMAN_POSITION = "UPDATE_PACMAN_POSITION",
}

export const LOCAL_STORAGE_TYPE = {
  USER_ID: "USER_ID",
  USERNAME: "USERNAME",
  CURRENT_MAP: "CURRENT_MAP",
  CURRENT_ROOM_ID: "CURRENT_ROOM_ID",
};
