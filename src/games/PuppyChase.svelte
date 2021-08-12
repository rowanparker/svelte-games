<script lang="ts">
    import {fly} from "svelte/transition";
    import GameTitle from "../components/GameTitle.svelte";
    import {onMount} from "svelte";
    import BigGameButton from "../components/BigGameButton.svelte";

    let bone: HTMLElement;
    let dog: HTMLElement;
    let yard: HTMLElement;

    let score: number = 0;
    let dogSpeed: number = 1;

    enum GameState {
        WaitingToStart,
        Playing,
        GameOver,
    }

    let gameState: GameState = GameState.WaitingToStart;

    onMount(() => {
        const gameContainer: HTMLElement = document.querySelector('.gameContainer');
        const gameContainerY = gameContainer.getBoundingClientRect().top + 10;
        gameContainer.style.height = `calc(100vh - ${gameContainerY}px)`;
        bone = document.querySelector('#game-bone');
        yard = document.querySelector('#game-yard');
        dog = document.querySelector('#game-dog');
        resetSpritePositions();
    })

    const resetSpritePositions = () => {
        // Bone starts horizontal centre, 3/4 from top
        bone.style.left = Math.floor(yard.getBoundingClientRect().width / 2 - bone.getBoundingClientRect().width / 2) + 'px';
        bone.style.top = Math.floor(yard.getBoundingClientRect().height / 4 * 3 - bone.getBoundingClientRect().height) + 'px';
        // Dog starts horizontal centre, 1/4 from top
        dog.style.left = Math.floor(yard.getBoundingClientRect().width / 2 - dog.getBoundingClientRect().width /2 ) + 'px';
        dog.style.top = Math.floor(yard.getBoundingClientRect().height / 4 - dog.getBoundingClientRect().height) + 'px';
    }

    const handleBoneMove = (bone: HTMLElement, yard: HTMLElement, rawX: number, rawY: number) => {
        if (gameState != GameState.Playing) return;

        const rectBone = bone.getBoundingClientRect();
        const rectYard = yard.getBoundingClientRect();

        let actualX = rawX - rectYard.left - (rectBone.width / 2);
        let actualY = rawY - rectYard.top - (rectBone.height / 2);

        if (actualY < 0) {
            actualY = 0;
        } else if (actualY + rectBone.height > rectYard.height) {
            actualY = rectYard.height - rectBone.height;
        }

        if (actualX < 0) {
            actualX = 0;
        } else if (actualX + rectBone.width > rectYard.width) {
            actualX = rectYard.width - rectBone.width;
        }

        bone.style.left = actualX + 'px';
        bone.style.top = actualY + 'px';
    };

    const handleMouseMove = (e) => {
        if (e.buttons === 0) {
            return;
        }

        handleBoneMove(bone, yard, e.clientX, e.clientY);
    }

    const handleTouchStart = (e) => {
        handleBoneMove(bone, yard, e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }

    const resetGame = () => {
        clearInterval(gameTickTimer);
        score = 0;
        dogSpeed = 1;
        gameState = GameState.WaitingToStart;
        resetSpritePositions();
    }

    const startGame = () => {
        gameState = GameState.Playing;
        gameTickTimer = setInterval(gameTick, 25);
    }

    const gameTick = () => {

        if (isDogTouchingBone()) {
            gameState = GameState.GameOver;
            clearInterval(gameTickTimer);
        }

        moveDog();
        score++;

        if (score > 100) {
            dogSpeed = 2;
        }
        if (score > 250) {
            dogSpeed = 3;
        }
        if (score > 500) {
            dogSpeed = 4;
        }
        if (score > 750) {
            dogSpeed = 5;
        }
        if (score > 1000) {
            dogSpeed = 6;
        }
        if (score > 1250) {
            dogSpeed = 7;
        }
        if (score > 1500) {
            dogSpeed = 8;
        }
        if (score > 1750) {
            dogSpeed = 9;
        }
        if (score > 2000) {
            dogSpeed = 10;
        }
    }

    const moveDog = ():void => {
        const rectBone = bone.getBoundingClientRect();
        const rectDog = dog.getBoundingClientRect();
        const rectYard = yard.getBoundingClientRect();

        if (rectDog.x > rectBone.x) {
            // Move dog left
            dog.style.left = rectDog.x - rectYard.left - dogSpeed + 'px';
        } else if (rectDog.x < rectBone.x) {
            // Move dog right
            dog.style.left = rectDog.x - rectYard.left + dogSpeed + 'px';
        }

        if (rectDog.y > rectBone.y) {
            // Move dog down
            dog.style.top = rectDog.y - rectYard.top - dogSpeed + 'px';
        } else if (rectDog.y < rectBone.y) {
            // Move dog up
            dog.style.top = rectDog.y - rectYard.top + dogSpeed + 'px';
        }
    }

    const isDogTouchingBone = ():boolean => {
        const rectBone = bone.getBoundingClientRect();
        const rectDog = dog.getBoundingClientRect();

        return (rectBone.x < rectDog.x + rectDog.width &&
            rectBone.x + rectBone.width > rectDog.x &&
            rectBone.y < rectDog.y + rectDog.height &&
            rectBone.y + rectBone.height > rectDog.y);
    };

    let gameTickTimer: number = null;


</script>

<div class="gameContainer">
    <GameTitle name={'Puppy Chase'}/>
    <div class="yardContainer">
        <div id="game-yard"
             on:touchstart={handleTouchStart}
        >
            <img alt="Dog"
                 id="game-dog"
                 draggable="false"
                 src="assets/img/puppyChase/dog-48x48.png"
             />
            <div id="game-bone">
                <img alt="Bone"
                     draggable="false"
                     src="assets/img/puppyChase/bone-48x48.gif"
                     on:mousemove={handleMouseMove}
                />
            </div>
        </div>
    </div>
    <div>

        {#if gameState === GameState.GameOver}
            <div class="gameOver" transition:fly>Game Over</div>
        {/if}

        <div class="score">
            Score: {score}
        </div>

        {#if gameState === GameState.WaitingToStart}
            <BigGameButton on:click={startGame} text="Start Game" pulse={true} />
        {:else}
            <BigGameButton on:click={resetGame} text="Reset Game" />
        {/if}
    </div>
</div>

<style>
    .gameContainer {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content 1fr;
        overflow-y: hidden;
    }
    .yardContainer {
        padding: 10px;
    }
    #game-yard {
        margin: 0 auto;
        width: 350px;
        height: 350px;
        background-color: #32913d;
        position: relative;
    }
    @keyframes bone {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    #game-dog {
        position: absolute;
        width: 48px;
        height: 48px;
    }
    #game-bone {
        position: absolute;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #game-bone img {
        animation-duration: 4000ms;
        animation-iteration-count: infinite;
        animation-name: bone;
        animation-timing-function: linear;
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
    .gameOver {
        font-family: 'Bangers', sans-serif;
        font-size: 40px;
        color: #ea7575;
        text-shadow: 1px 1px 2px darkred;
        width: 300px;
        margin: 0 auto;
        text-align: center;
    }
</style>