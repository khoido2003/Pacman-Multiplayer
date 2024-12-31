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
  width: number;
  height: number;
  tiles: number[][];
}

export const MESSAGE_TYPE = {
  CREATE_MATCH: "CREATE_MATCH",
};
