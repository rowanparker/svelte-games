<script lang="ts">
    import {fly} from "svelte/transition";
    import GameTitle from "../components/GameTitle.svelte";
    import BigGameButton from "../components/BigGameButton.svelte";
    import {getRandomIntInclusive} from "../utils";
    import {
        createUpBoundForMatches,
        createLeftBoundForMatches,
        checkMatchUp,
        checkMatchLeft,
    } from "./jewelSwap/utils";
    import ExplosionGenerator from "../components/effects/ExplosionGenerator.svelte";

    import {animateCellsFalling} from "./jewelSwap/stores";

    let movesRemaining: number;
    let board: Array<number>
    let gameState: GameState;
    const gridSize: number = 5;
    let score: number = 0;
    let numberJewelTypes: number = 7;
    let swapSource: number|null = null;
    let swapTarget: number|null = null;
    let swapInOut: Array<number> = [];
    let swapOut: Array<number> = [];
    let swapIn: Array<number> = [];
    let validTargetCells: Array<number> = [];
    let allowClick = true;
    let animateExplode: Array<number> = [];

    // Build 4 arrays, to track up, down, left and right boundaries.
    // For example, if a cell is in the first or second column,
    // there is no point checking for a match to the left, as there
    // will not be sufficient cells to make 3 in a row.
    let ignoreUpCheck: Array<number> = createUpBoundForMatches(gridSize);
    let ignoreLeftCheck: Array<number> = createLeftBoundForMatches(gridSize);

    const swapTime: number = 300;

    enum Jewels {
        Red,
        Green,
        Blue,
        Orange,
        Gold,
        Silver,
        Grey,
    }

    enum GameState {
        Waiting,
        Playing,
        GameOver
    }

    const playCellSwap = (): void => {

        // Stop valid cell animations
        validTargetCells = [];

        // Get values from parent Svelte container
        // swapSource is used to play the scale animation
        // which we want to stop immediately to play out swap animation
        // so we save the value locally, then set swapSpace to null
        // set swapTarget to null for cleanliness
        const sourceIndex = swapSource;
        const targetIndex = swapTarget;
        swapSource = null;
        swapTarget = null;

        // Block mouse clicks until animation is done
        allowClick = false;

        // Get values from board that we wish to swap
        const sourceValue = board[sourceIndex];
        const targetValue = board[targetIndex];

        // Start transition
        swapInOut = [sourceIndex, targetIndex];

        (new Audio('assets/audio/move.mp3')).play();

        // Half way through animation (while opacity is zero), swap values
        setTimeout(() => {
            board[targetIndex] = sourceValue;
            board[sourceIndex] = targetValue;
        }, swapTime / 2);

        // Remove transition class, enable mouse clicks
        setTimeout(() => {
            swapInOut = [];
            processMatches();
        }, swapTime);
    }

    const handleCellClick = (i) => {

        // In the middle of a swap animation, do nothing
        if ( ! allowClick) {
            return;
        }

        (new Audio('assets/audio/select.mp3')).play();

        // This cell is already selected as the source, so de-select it.
        if (swapSource === i) {
            swapSource = null;
            setValidTargetCells(swapSource);
            return;
        }

        // This click is setting the source
        if (null === swapSource) {
            swapSource = i;
            setValidTargetCells(swapSource);
            return;
        }

        // This click is setting the target
        // but it's not in the valid targets
        // so make it the source, but to make
        // animations consistent, remove valid targets
        // then set swap after a small delay
        if (validTargetCells.indexOf(i) < 0) {
            validTargetCells = [];
            setTimeout(() => {
                swapSource = i;
                setValidTargetCells(swapSource);
            }, 50);

            return;
        }

        swapTarget = i;
        movesRemaining--;
        playCellSwap();

        if (movesRemaining < 1) {
            gameState = GameState.GameOver;
        }
    }

    const generateJewel = () => {
        return getRandomIntInclusive(0, numberJewelTypes - 1);
    }

    /**
     * Sets the validTargetCell class on relevant cells.
     */
    const setValidTargetCells = (selectedCell: number | null): void => {

        let i: number;
        let constraints: Array<number>;

        validTargetCells = [];

        if (null === selectedCell) {
            return;
        }

        // Up
        if (selectedCell > gridSize) {
            validTargetCells = [selectedCell - gridSize];
        }

        // Down
        if (selectedCell < gridSize * (gridSize - 1)) {
            validTargetCells = [...validTargetCells, selectedCell + gridSize];
        }

        // Left
        constraints = [];
        for(i = 0; i < gridSize; i++) {
            constraints = [...constraints, i * gridSize];
        }

        if (constraints.indexOf(selectedCell) === -1) {
            validTargetCells =[...validTargetCells, selectedCell - 1];
        }

        // Right
        constraints = [];
        for(i = 0; i < gridSize; i++) {
            constraints = [...constraints, (i * gridSize) + gridSize - 1];
        }

        if (constraints.indexOf(selectedCell) === -1) {
            validTargetCells =[...validTargetCells, selectedCell + 1];
        }
    }

    const startGame = ():void => {
        gameState = GameState.Playing;
        processMatches();
    }

    const resetGame = (init: boolean = false) => {
        movesRemaining = 25;
        swapSource = swapTarget = null;
        validTargetCells = [];
        swapIn = [];
        swapOut = [];
        allowClick = false;
        gameState = GameState.Waiting;
        board = Array(gridSize * gridSize);

        for (let i = 0; i < board.length; i++) {
            board[i] = generateJewel();
        }
        score = 0;

        if ( ! init) {
            gameState = GameState.Playing;
            allowClick = false;
        }
    }

    const processMatches = () => {
        let matches: Array<number>;

        while ((matches = checkMatches()).length > 0) {
            animateExplode = [...animateExplode, ...matches];

            matches.forEach(cell => {
                board[cell] = null;
                score++;
            });

            (new Audio('assets/audio/coin.mp3')).play();
        }

        setTimeout(() => {
            animateExplode = [];

            // Push all floating cells down
            board = fillEmptyCells(board, gridSize, animateCellsFalling);

            /**
             * If filling in the empty cells has created new matches then call the method again.
             *
             * Wait for a small delay to allow the cellsFalling animation to finish playing.
             *
             * Return immediately, so that we don't allow clicks.
             **/
            if (checkMatches().length > 0) {
                setTimeout(processMatches, 350);
                return;
            }

            /**
             * All matches should be cleared. Allow user interaction again.
             **/
            allowClick = true;
        }, 450);
    }

    const fillEmptyCells = (board: Array<number>,
                            gridSize: number,
                            animateCellsFalling // TODO type
    ): Array<number> => {

        let i;
        let inf = 0;

        /**
         * Loops through the board until all cells have a value.
         *
         * Each while loop only moves 1 cell down at a time.
         * For example if a 3-cell vertical match has been removed,
         * it will take 3 loops to move a value down to the most
         * bottom empty cell.
         */
        while (inf < 200 && board.filter(v => v === null).length > 0) {

            // TODO could loop just on the above filter
            for (i = board.length - 1; i >= 0; i--) {

                // Cell has a jewel, so continue to next cell
                if (board[i] !== null) {
                    continue;
                }

                // Cell is top row, so generate a new value, then break for loop
                if (i < gridSize) {
                    board[i] = generateJewel();
                    animateCellsFalling.update(cur => [...cur, i]);
                    break;
                }

                // Cell above has a jewel, so move it down
                // Then break for loop to restart
                if (board[i - gridSize] !== null) {
                    board[i] = board[i - gridSize];
                    board[i - gridSize] = null;
                    animateCellsFalling.update(cur => [...cur, i]);
                    break;
                }
            }
            inf++;
        }

        setTimeout(() => {
            animateCellsFalling.set([]);
        }, 1000);

        return board;

    }

    /**
     * Iterates through board from bottom-right to top-left,
     * removing any matching cells (3 in a row or column).
     *
     * As soon as it finds it's first match, it clears
     * the cells, shifts everything down,
     * generates cells for the blanks.
     *
     * Then it recalls itself. It's recursive until all matches
     * are cleared.
     *
     */
    const checkMatches = (): Array<number> => {
        let i: number;
        let matches: Array<number>;

        for (i = board.length - 1; i >= 0; i--) {

            if (ignoreLeftCheck.indexOf(i) === -1) {
                if ((matches = checkMatchLeft(board, i)).length > 0) {
                    return matches;
                }
            }

            if (ignoreUpCheck.indexOf(i) === -1) {
                if ((matches = checkMatchUp(board, i, gridSize)).length > 0) {
                    return matches;
                }
            }
        }

        return [];
    }

    resetGame(true);
</script>

<GameTitle name={'Jewel Swap'}/>

<div class="instructions">
    Click cells to swap.
</div>

<div class="board" style="--grid-size: {gridSize}">
    {#each board as v, k}
        <div class="cell"
             style="--swap-time: {`${swapTime}ms`}"
             class:jewelRed={v === Jewels.Red}
             class:jewelGreen={v === Jewels.Green}
             class:jewelBlue={v === Jewels.Blue}
             class:jewelOrange={v === Jewels.Orange}
             class:jewelGold={v === Jewels.Gold}
             class:jewelSilver={v === Jewels.Silver}
             class:jewelGrey={v === Jewels.Grey}
             class:swapSource={k === swapSource}
             class:swapInOut={swapInOut.indexOf(k) > -1}
             class:animateExplode={animateExplode.indexOf(k) > -1}
             class:animateCellsFalling={$animateCellsFalling.indexOf(k) > -1}
             class:validTargetCells={validTargetCells.indexOf(k) > -1}
             on:click={() => handleCellClick(k)}
        >
            {#if animateExplode.indexOf(k) > -1}
                <ExplosionGenerator />
            {/if}
        </div>
    {/each}
</div>

{#if gameState === GameState.GameOver}
    <div class="gameOver" transition:fly>Game Over</div>
{/if}

<div class="score">
    Score: {score}
</div>

<div class="moveRemaining">
    Moves Left: {movesRemaining}
</div>

{#if gameState === GameState.Waiting}
    <BigGameButton on:click={startGame} text="Start Game" pulse={true} />
{:else}
    <BigGameButton on:click={resetGame} text="Reset Game" />
{/if}

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

    .moveRemaining {
        font-family: 'Bangers', sans-serif;
        font-size: 30px;
        color: #4d6080;
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
        grid-gap: 4px;
    }
    .cell {
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-shadow: 1px 1px 2px #333;
        cursor: pointer;
    }
    @keyframes cellPulse {
        0% {
            transform: scale(1.0);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1.0);
        }
    }
    @keyframes swapInOut {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        45% {
            transform: scale(0);
            opacity: 0;
        }
        55% {
            transform: scale(0);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes animateCellsFalling {
        from {
            transform: translateY(-50px);
        }
        to {
            transform: translateY(0);
        }
    }
    .animateCellsFalling {
        animation-name: animateCellsFalling;
        animation-iteration-count: 1;
        animation-duration: 250ms;
        animation-timing-function: ease-in-out;
    }

    @keyframes explode {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    .animateExplode {
        animation-name: explode;
        animation-iteration-count: 1;
        animation-duration: 500ms;
        opacity: 0;
    }
    .swapInOut {
        animation-name: swapInOut;
        animation-iteration-count: 1;
        animation-duration: var(--swap-time);
    }
    .swapSource {
        animation-name: cellPulse;
        animation-iteration-count: infinite;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
    }
    .validTargetCells {
        border: 4px solid #5e503a;
        animation-name: cellPulse;
        animation-iteration-count: infinite;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
    }


    .jewelRed, .jewelGreen, .jewelBlue, .jewelOrange,
    .jewelGold, .jewelSilver, .jewelGrey {

    }
    .jewelRed {
        background: #FFA089;
        background: linear-gradient(to top, #FFA89D, #FFA089);

    }
    .jewelGreen {
        background: #56ab2f;
        background: linear-gradient(to bottom, #a8e063, #56ab2f);

    }
    .jewelBlue {
        background: #36D1DC;
        background: linear-gradient(to top, #5B86E5, #36D1DC);

    }
    .jewelOrange {
        background: #FDC830;
        background: linear-gradient(to top, #F37335, #FDC830);

    }
    .jewelGold {
        background: #CAC531;
        background: linear-gradient(to bottom, #F3F9A7, #CAC531);

    }
    .jewelSilver {
        background: #abbaab;
        background: linear-gradient(to bottom, #ffffff, #abbaab);


    }
    .jewelGrey {
        background: #304352;
        background: linear-gradient(to bottom, #d7d2cc, #304352);

    }

    .instructions {
        margin: 5px auto;
        text-align: center;
        font-size: 80%;
    }
</style>