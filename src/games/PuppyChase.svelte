<script lang="ts">
    import GameTitle from "../components/GameTitle.svelte";
    import {onMount} from "svelte";
    import BigGameButton from "../components/BigGameButton.svelte";

    let grabbing: boolean = false;

    let bone: HTMLElement;
    let dog: HTMLElement;
    let yard: HTMLElement;

    onMount(() => {
        const gameContainer: HTMLElement = document.querySelector('.gameContainer');
        const gameContainerY = gameContainer.getBoundingClientRect().top + 10;
        gameContainer.style.height = `calc(100vh - ${gameContainerY}px)`;
        bone = document.querySelector('#game-bone');
        yard = document.querySelector('#game-yard');
        dog = document.querySelector('#game-dog');
        // Bone starts horizontal centre, 3/4 from top
        bone.style.left = Math.floor(yard.getBoundingClientRect().width / 2 - bone.getBoundingClientRect().width / 2) + 'px';
        bone.style.top = Math.floor(yard.getBoundingClientRect().height / 4 * 3 - bone.getBoundingClientRect().height) + 'px';
        // Dog starts horizontal centre, 1/4 from top
        dog.style.left = Math.floor(yard.getBoundingClientRect().width / 2 - dog.getBoundingClientRect().width /2 ) + 'px';
        dog.style.top = Math.floor(yard.getBoundingClientRect().height / 4 - dog.getBoundingClientRect().height) + 'px';
    })

    const handleBoneMove = (bone: HTMLElement, yard: HTMLElement, rawX: number, rawY: number) => {
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

    const handleTouchMove = (e) => {
        handleBoneMove(bone, yard, e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }

    const startGame = () => {
        gameTickTimer = setInterval(gameTick, 500);
    }

    const gameTick = () => {

        if (isDogTouchingBone()) {
            // TODO handle collision, i.e. game end
        }

        // TODO handle dog movement
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
        <div id="game-yard">
            <img alt="Dog"
                 id="game-dog"
                 draggable="false"
                 src="assets/img/puppyChase/dog-48x48.png"
             />
            <div id="game-bone">
                <img alt="Bone"
                     draggable="false"
                     src="assets/img/puppyChase/bone-48x48.gif"
                     on:touchmove={handleTouchMove}
                     on:mousemove={handleMouseMove}
                />
            </div>
        </div>
    </div>
    <div>
        <BigGameButton on:click={startGame} text="Start Game" pulse={true} />
    </div>
</div>

<style>
    .gameContainer {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr min-content;
        overflow-y: hidden;
    }
    .yardContainer {
        padding: 10px;
    }
    #game-yard {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        max-width: 800px;
        max-height: 1600px;
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
</style>