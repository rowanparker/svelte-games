export const createLeftBoundForMatches = (gridSize: number): Array<number> => {
    let column, row: number;
    let bounds = [];

    for (column = 0; column < 2; column++) {
        for (row = 0; row < gridSize; row++) {
            bounds = [...bounds, (row * gridSize) + column];
        }
    }

    return bounds;
}

/**
 * @deprecated No longer required, all match searches move left to right, bottom to top
 * @param gridSize
 */
export const createRightBoundForMatches = (gridSize: number): Array<number> => {
    let column, row: number;
    let bounds = [];

    for (column = gridSize; column > (gridSize - 2); column--) {
        for (row = 0; row < gridSize; row++) {
            bounds = [...bounds, (row * gridSize) + column - 1];
        }
    }

    return bounds;
}

export const createUpBoundForMatches = (gridSize: number): Array<number> => {
    let i: number;
    let bounds = [];

    for (i = 0; i < gridSize * 2; i++) {
        bounds = [...bounds, i];
    }

    return bounds;
}

/**
 * @deprecated No longer required, all match searches move left to right, bottom to top
 * @param gridSize
 */
export const createDownBoundForMatches = (gridSize: number): Array<number> => {
    let i: number;
    let bounds = [];

    for (i = (gridSize * gridSize) - 1; i >= (gridSize * gridSize) - (gridSize * 2); i--) {
        bounds = [...bounds, i];
    }

    return bounds;
}

export const checkMatchLeft = (board: Array<number>, checkCell: number): Array<number> => {

    if (board[checkCell] !== board[checkCell - 1]
     || board[checkCell] !== board[checkCell - 2]
     || board[checkCell] === null) {
        return [];
    }

    return [checkCell, checkCell - 1, checkCell - 2];
}

export const checkMatchUp = (board: Array<number>, checkCell: number, gridSize: number): Array<number> => {

    if (board[checkCell] !== board[checkCell - gridSize]
     || board[checkCell] !== board[checkCell - (2 * gridSize)]
     || board[checkCell] === null) {
        return [];
    }

    return [checkCell, checkCell - gridSize, checkCell - (2 * gridSize)];
}