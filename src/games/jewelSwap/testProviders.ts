export const providerNoMatches = (): Array<number> => {
    let board: Array<number> = Array(25);
    board[0] = 0;
    board[1] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 0;

    board[5] = 1;
    board[6] = 2;
    board[7] = 3;
    board[8] = 0;
    board[9] = 1;

    board[10] = 2;
    board[11] = 3;
    board[12] = 0;
    board[13] = 1;
    board[14] = 2;

    board[15] = 3;
    board[16] = 0;
    board[17] = 1;
    board[18] = 2;
    board[19] = 3;

    board[20] = 0;
    board[21] = 1;
    board[22] = 2;
    board[23] = 3;
    board[24] = 0;

    return board;
}

export const providerMatchAfterFill = (): Array<number> => {

    let board = providerNoMatches();

    // Match on first process
    board[10] = 6;
    board[15] = 6;
    board[20] = 6;

    // Match on second process
    board[5] = 5;
    board[22] = 5;
    board[21] = 5;

    return board;
}