<script lang="ts">
    import {fly} from "svelte/transition";
    import GameTitle from "../components/GameTitle.svelte";
    import ResetGameButton from "../components/ResetGameButton.svelte";
    import {getRandomIntInclusive} from "../utils";
    import {
        createUpBoundForMatches,
        createDownBoundForMatches,
        createLeftBoundForMatches,
        createRightBoundForMatches,
        checkMatchUp,
        checkMatchLeft,
    } from "./jewelSwap/utils";

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
    let ignoreDownCheck: Array<number> = createDownBoundForMatches(gridSize);
    let ignoreLeftCheck: Array<number> = createLeftBoundForMatches(gridSize);
    let ignoreRightCheck: Array<number> = createRightBoundForMatches(gridSize);

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
        //then set swap after a small delay
        if (validTargetCells.indexOf(i) < 0) {
            validTargetCells = [];
            setTimeout(() => {
                swapSource = i;
                setValidTargetCells(swapSource);
            }, 50);

            return;
        }

        swapTarget = i;
        playCellSwap();
    }

    const generateJewel = () => {
        return getRandomIntInclusive(0, numberJewelTypes - 1);
    }

    /**
     * Sets the validTargetCell class on relevant cells.
     */
    const setValidTargetCells = (selectedCell: number|null): void => {

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

    const resetGame = () => {
        swapSource = swapTarget = null;
        validTargetCells = [];
        swapIn = [];
        swapOut = [];
        allowClick = true;
        gameState = GameState.Waiting;
        board = Array(gridSize * gridSize);

        for (let i = 0; i < board.length; i++) {

            board[i] = generateJewel();
        }
        score = 0;

        // board[0] = 1;
        board[5] = 1;
        board[10] = 1;
        board[15] = 1;
        // board[17] = 2;
        // board[18] = 2;
        // board[19] = 2;

        processMatches();


    }

    const processMatches = () => {
        let matches: Array<number>;

        while ((matches = checkMatches()).length > 0) {
            animateExplode = [...animateExplode, ...matches];

            matches.forEach(cell => {
                board[cell] = null;
                score++;
            })
        }

        setTimeout(() => {
            animateExplode = [];

            // Push all floating cells down
            // TODO implement
            // applyCellGravity(board, gridSize);

            allowClick = true;
        }, 10000);
    }

    const applyCellGravity = (board: Array<number>, gridSize: number): void => {
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

                console.log('applyCellGravity: checking cell ' + i);

                // Cell has a jewel, so continue to next cell
                if (board[i] !== null) {
                    console.log('applyCellGravity: cell ' + i + ' is not empty, skipping');
                    continue;
                }

                // Cell is top row, so generate a new value, then break for loop
                if (i < gridSize) {
                    console.log('applyCellGravity: cell ' + i + ' is top row, generating');
                    board[i] = generateJewel();
                    break;
                }

                // Cell above has a jewel, so move it down
                // Then break for loop to restart
                if (board[i - gridSize] !== null) {
                    console.log('applyCellGravity: cell above cell ' + i + ' has jewel, moving down');
                    board[i] = board[i - gridSize];
                    board[i - gridSize] = null;
                    break;
                }
            }
            inf++;
        }

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

    resetGame();
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
             class:validTargetCells={validTargetCells.indexOf(k) > -1}
             on:click={() => handleCellClick(k)}
        >
            {k}
        </div>
    {/each}
</div>

{#if gameState === GameState.GameOver}
    <div class="gameOver" transition:fly>Game Over</div>
{/if}

<div class="score">
    Score: {score}
</div>

<ResetGameButton on:resetGame={resetGame} />

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
    .animateExplode {
        /* TODO implement */
        background-color: #000 !important;
    }
    .swapInOut {
        animation-name: swapInOut;
        animation-iteration-count: 1;
        animation-duration: var(--swap-time);
    }
    .swapSource {
        /*border: 4px solid #5e503a;*/
        animation-name: cellPulse;
        animation-iteration-count: infinite;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
        /*filter: saturate(20%);*/
    }
    .validTargetCells {
        border: 4px solid #5e503a;
        /*border: 4px solid #a59882;*/
        animation-name: cellPulse;
        animation-iteration-count: infinite;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
        /*filter:brightness(150%);*/
    }
    .jewelRed {
        /*background: #ED213A;*/
        /*background: linear-gradient(to top, #93291E, #ED213A);*/
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