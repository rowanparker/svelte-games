<script lang="ts">
    import GameTitle from "../components/GameTitle.svelte";
    import BigGameButton from "../components/BigGameButton.svelte";
    let board: Array<number>;
    let gameState: number;

    enum GameState {
        WaitingPlayer1,
        WaitingPlayer2,
        GameOverPlayer1Wins,
        GameOverPlayer2Wins,
        GameOverDraw
    }

    const gameStateLabels = (new Map())
        .set(GameState.WaitingPlayer1, 'Waiting for Player 1')
        .set(GameState.WaitingPlayer2, 'Waiting for Player 2')
        .set(GameState.GameOverPlayer1Wins, 'Game Over - Player 1 Wins')
        .set(GameState.GameOverPlayer2Wins, 'Game Over - Player 2 Wins')
        .set(GameState.GameOverDraw, 'Game Over - Draw');

    const resetGame = () => {
        gameState = GameState.WaitingPlayer1;
        board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ];
    }

    const cellClick = (i: number): void => {

        // Already set, do nothing
        if (board[i] !== 0) {
            return;
        }

        switch (gameState) {
            case GameState.WaitingPlayer1:
                board[i] = 1;
                break;
            case GameState.WaitingPlayer2:
                board[i] = 2;
                break;
        }

        updateGameState();

    }

    const updateGameState = () => {

        const winningCombinations = [
            // Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // Cols
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // Diag
            [0, 4, 8],
            [6, 4, 2],
        ]

        let winner = 0;

        // Check if there are any winning combinations
        winningCombinations.forEach(combo => {

            if (winner > 0) {
                return;
            }

            if (board[combo[0]] === board[combo[1]]
                && board[combo[1]] === board[combo[2]]
                && board[combo[0]] !== 0
            ) {
                if (board[combo[0]] === 1) {
                    winner = 1;
                } else {
                    winner = 2;
                }
            }
        });

        switch (winner) {
            case 1:
                gameState = GameState.GameOverPlayer1Wins;
                return;
            case 2:
                gameState = GameState.GameOverPlayer2Wins;
                return;
        }

        // No winning combo, now check if there are any empty cells
        if (board.filter(v => v === 0).length === 0) {
            gameState = GameState.GameOverDraw;
            return;
        }

        // Switch player waiting
        gameState = (gameState === GameState.WaitingPlayer1)
            ? GameState.WaitingPlayer2
            : GameState.WaitingPlayer1;
    }

    resetGame();
</script>

<GameTitle name={'Tic Tac Toe'}/>

<div class="status"
     class:player1={gameState === GameState.GameOverPlayer1Wins}
     class:player2={gameState === GameState.GameOverPlayer2Wins}
>
    {gameStateLabels.get(gameState)}
</div>

<div class="board">
    {#each board as v, k}
        <div class="cell"
             class:player1={v === 1}
             class:player2={v === 2}
             on:click={() => cellClick(k)}
        >
            {(v === 1) ? 'X':''}
            {(v === 2) ? 'O':''}
        </div>
    {/each}
</div>

<BigGameButton on:click={resetGame} text="Reset Game" />

<style>
    .status, .board {
        text-align: center;
    }
    .status {
        text-align: center;
        width: 300px;
        padding: 10px 0;
        border: 1px solid #cec4b3;
        background-color: #fff;
        margin: 10px auto;
    }
    .board {
        margin: 10px auto;
        width: 300px;
        height: 300px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 10px;
    }
    .cell {
        --aspect-ratio: 1/1;
        cursor: pointer;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 60px;
    }
    .player1 {
        background-color: #cb997e;
        color: #ffe8d6;
    }
    .player2 {
        background-color: #6b705c;
        color: #b7b7a4
    }
</style>