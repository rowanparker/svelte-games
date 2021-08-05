<script lang="ts">
    import {onDestroy} from "svelte";
    import {fly} from "svelte/transition";
    import BigGameButton from "../components/BigGameButton.svelte";
    import GameTitle from "../components/GameTitle.svelte";

    let board: Array<number> = [];
    let currentCell: number;
    let currentDirection: Direction | null;
    let intervalGameTick: number | null = null;
    let snake: Array<number> = [];
    let snakeLength: number = 3;
    let gameState: number;
    let score: number = 0;
    let gemCell: number | null = null;
    let counterGenerateGem: number;
    let ticksToGenerateGem: number = 5;
    let ticksInterval = 100;
    const gridSize = 16;

    enum GameState {
        Waiting,
        Playing,
        GameOver,
    }

    enum Direction {
        Up,
        Down,
        Left,
        Right
    }

    const resetGame = () => {
        gameState = GameState.Waiting;
        board = Array(gridSize * gridSize);
        currentCell = (gridSize * gridSize / 2) + (gridSize / 2);
        currentDirection = null;
        snake = [];
        snakeLength = 3;
        score = 0;
        gemCell = null;
        gemCell = 53;
        counterGenerateGem = ticksToGenerateGem;
        clearInterval(intervalGameTick);
        intervalGameTick = null;
    }

    const addToSnake = (current: number): void => {
        if (snake.indexOf(current) > -1) {
            return;
        }

        snake = [current, ...snake.splice(0, snakeLength - 2)];
    }

    const generateGemCell = (boardCells: Array<number>,
                             snakeHeadCell: number,
                             snakeBodyCells: Array<number>): number => {

        let available = [...boardCells.keys()].filter((v, k) => {
            return (!(snakeHeadCell === k || snakeBodyCells.indexOf(k) > -1));
        });

        return available[Math.floor(Math.random() * available.length)];
    }

    const gameTick = () => {
        switch (gameState) {
            case GameState.GameOver:
                clearInterval(intervalGameTick);
                intervalGameTick = null;
                return;
        }

        let i: number;
        const boundaries: Array<number> = [];
        let collideBoundary: boolean = false;
        let collideSnake: boolean = false;
        let newCell: number | null = null;

        // Check boundary collision
        switch (currentDirection) {
            case Direction.Up:
                // Top boundary is zero to gridSize
                if (currentCell < gridSize) {
                    collideBoundary = true;
                } else {
                    newCell = currentCell - gridSize;
                }
                break;

            case Direction.Down:
                // Bottom boundary is (gridSize - 1) * gridSize to gridSize * gridSize
                if (currentCell > (gridSize - 1) * gridSize - 1) {
                    collideBoundary = true;
                } else {
                    newCell = currentCell + gridSize;
                }
                break;

            case Direction.Left:
                for (i = 0; i < gridSize; i++) {
                    boundaries.push(i * gridSize);
                }

                // Left boundary is array of [0 to gridSize - 1] * 1
                if (boundaries.indexOf(currentCell) > -1) {
                    collideBoundary = true;
                } else {
                    newCell = currentCell - 1;
                }
                break;

            case Direction.Right:
                // Right boundary is array of [1 to gridSize] * gridSize
                for (i = 1; i <= gridSize; i++) {
                    boundaries.push((i * gridSize) - 1);
                }

                if (boundaries.indexOf(currentCell) > -1) {
                    collideBoundary = true;
                } else {
                    newCell = currentCell + 1;
                }
                break;
        }

        // Check if collide with self
        if (snake.indexOf(currentCell) > -1) {
            collideSnake = true;
        }

        if (collideBoundary || collideSnake) {
            gameState = GameState.GameOver;
            clearInterval(intervalGameTick);
            return;
        }

        if (gemCell === null) {

            if (counterGenerateGem < 1) {
                gemCell = generateGemCell(board, currentCell, snake);
            } else {
                counterGenerateGem--;
            }

        } else {

            // Check if we are on a gem
            if (gemCell === currentCell) {
                gemCell = null;
                counterGenerateGem = ticksToGenerateGem;
                score++;
                snakeLength++;
            }
        }

        addToSnake(currentCell);

        currentCell = newCell;
    }

    const startGameTick = () => {
        gameState = GameState.Playing;
        intervalGameTick = setInterval(gameTick, ticksInterval);
    }

    const handleKeyDown = (e: KeyboardEvent) => {

        switch (e.code) {
            case 'ArrowUp':
                if (currentDirection !== Direction.Down) {
                    currentDirection = Direction.Up;
                }
                break;
            case 'ArrowDown':
                if (currentDirection !== Direction.Up) {
                    currentDirection = Direction.Down;
                }
                break;
            case 'ArrowLeft':
                if (currentDirection !== Direction.Right) {
                    currentDirection = Direction.Left;
                }
                break;
            case 'ArrowRight':
                if (currentDirection !== Direction.Left) {
                    currentDirection = Direction.Right;
                }
                break;
            default:
                return;
        }

        if (null === intervalGameTick) {
            startGameTick();
        }
    }

    onDestroy(() => {
        clearInterval(intervalGameTick);
    })


    document.addEventListener('keydown', handleKeyDown);

    resetGame();
</script>

<GameTitle name={'Snake'}/>

<div class="instructions">
    Use arrow keys start playing.
</div>

<div class="board" style="--grid-size: {gridSize}">
    {#each board as v, k}
        <div class="cell"
             class:gem={gemCell === k && currentCell !== k}
             class:snakeTail={(snake.indexOf(k) > -1)}
             class:snakeHead={currentCell === k}
        >
        </div>
    {/each}
</div>

{#if gameState === GameState.GameOver}
<div class="gameOver" transition:fly>Game Over</div>
{/if}

<div class="score">
    Score: {score}
</div>

<BigGameButton on:click={resetGame} text="Reset Game" />

<style>

    .gameOver {
        font-family: 'Bangers', sans-serif;
        font-size: 70px;
        color: #ea7575;
        text-shadow: 1px 1px 2px darkred;
        width: 300px;
        margin: 0 auto;
        text-align: center;
    }

    .score {
        font-family: 'Bangers', sans-serif;
        font-size: 40px;
        color: #fff;
        text-shadow: 1px 1px 2px #999;
        width: 300px;
        margin: 0 auto;
        text-align: center;
    }

    .board {
        margin: 0 auto;
        width: 300px;
        height: 300px;
        display: grid;
        grid-template-columns: repeat(var(--grid-size), 1fr);
        grid-template-rows: repeat(var(--grid-size), 1fr);
        grid-gap: 2px;
    }

    .cell {
        background-color: #fff;
        border-radius: 2px;

    }
    .cell.gem {
        background: rgb(242,153,74);
        background: linear-gradient(0deg, rgba(242,153,74,1) 0%, rgba(242,201,76,1) 100%);
    }
    .cell.snakeTail {
        background-color: #6b705c;
    }
    .cell.snakeHead {
        background-color: #cb997e;
    }
    .instructions {
        margin: 5px auto;
        text-align: center;
        font-size: 80%;
    }
</style>